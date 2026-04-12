import type { UserProfile, UpdateUserProfileDTO } from '~/types/user'

/**
 * useUser - Singleton-style composable for managing user profile and identity.
 * Handles state synchronization between local reactive properties and the backend API.
 */
export const useUser = () => {
    // States are persistent across the application thanks to Nuxt's useState keys.
    const user = useState<{ email: string; createdAt: string | null } | null>('user-data', () => null)
    const profile = useState<UserProfile | null>('user-profile', () => null)
    const loading = useState('user-loading', () => false)
    
    // 2FA login state
    const twoFactorTempToken = useState<string | null>('2fa-temp-token', () => null)
    const twoFactorEmail = useState<string | null>('2fa-email', () => null)

    // Config and i18n must be accessed within the setup context.
    const config = useRuntimeConfig()
    const { setLocale } = useI18n()

    /**
     * fetchUser - Loads the user account (auth) and its associated profile from the API.
     */
    const fetchUser = async () => {
        loading.value = true
        try {
            const [userData, profileData] = await Promise.all([
                $fetch<{ email: string; createdAt: string | null }>(`/api/auth/me`),
                $fetch<UserProfile>(`${config.public.apiBase}/api/user/profile`, {
                    credentials: 'include'
                }).catch(() => null)
            ])
            user.value = userData
            if (profileData) {
                profile.value = profileData
                if (profileData.language) {
                    // Fix ts(2345): Casting specifically to supported locales
                    await setLocale(profileData.language as 'es' | 'en')
                }
            }
        } catch (e) {
            console.error('Error fetching user data:', e)
        } finally {
            loading.value = false
        }
    }

    /**
     * updateProfile - Updates the profile on the server and synchronizes the local state instantly.
     */
    const updateProfile = async (data: UpdateUserProfileDTO) => {
        try {
            const updated = await $fetch<UserProfile>(`${config.public.apiBase}/api/user/profile`, {
                method: 'PUT',
                body: data,
                credentials: 'include'
            })
            // Updating the shared state instantly triggers reactivity across all referencing components.
            profile.value = updated
            if (updated.language) {
                await setLocale(updated.language as 'es' | 'en')
            }
            return updated
        } catch (e) {
            console.error('Error updating profile:', e)
            throw e
        }
    }

    // Computed properties are derived from the shared useState values.
    // They reference the SAME global states ('user-profile', etc.).
    const email = computed(() => user.value?.email || '')
    
    const displayName = computed(() => {
        const name = profile.value?.name?.trim()
        if (name) return name
        const e = email.value
        if (e && e.includes('@')) {
            const parts = e.split('@')
            if (parts[0]) return parts[0]
        }
        return e || 'Usuario'
    })
    
    const avatarUrl = computed(() => profile.value?.avatar_url || '')
    const language = computed(() => profile.value?.language || 'es')

    const initials = computed(() => {
        const name = profile.value?.name?.trim()
        if (name) {
            const parts = name.split(/\s+/)
            const first = parts[0]
            const second = parts[1]
            if (parts.length >= 2 && first && second && first[0] && second[0]) {
                return (first[0] + second[0]).toUpperCase()
            }
            if (first && first[0]) return first.slice(0, 2).toUpperCase()
        }
        const e = email.value
        if (!e) return '?'
        const parts = e.split('@')
        const local = parts[0] || ''
        return local.slice(0, 2).toUpperCase()
    })

    const avatarColor = computed(() => {
        const seed = profile.value?.name || email.value
        if (!seed) return 'hsl(160, 60%, 40%)'
        let hash = 0
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash)
        }
        const hue = Math.abs(hash) % 360
        return `hsl(${hue}, 55%, 45%)`
    })

    const createdAt = computed(() => user.value?.createdAt || null)
    const twoFactorEnabled = computed(() => profile.value?.two_factor_enabled || false)

    const logout = async () => {
        const { clearVault } = useVault()
        const { clearMasterPassword, clearUserEmail } = useMasterPassword()

        try {
            await $fetch(`${config.public.apiBase}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })
        } catch (e) {
            console.error('Logout error:', e)
        } finally {
            user.value = null
            profile.value = null
            clearVault()
            clearMasterPassword()
            clearUserEmail()
            navigateTo('/login')
        }
    }

    return { 
        user, 
        profile,
        email, 
        displayName,
        avatarUrl,
        language,
        initials, 
        avatarColor, 
        createdAt, 
        twoFactorEnabled,
        twoFactorTempToken,
        twoFactorEmail,
        loading, 
        fetchUser,
        updateProfile,
        logout
    }
}
