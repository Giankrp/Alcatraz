import type { UserProfile, UpdateUserProfileDTO } from '~/types/user'

export const useUser = () => {
    const user = useState<{ email: string; createdAt: string | null } | null>('user-data', () => null)
    const profile = useState<UserProfile | null>('user-profile', () => null)
    const loading = useState('user-loading', () => false)

    const fetchUser = async () => {
        loading.value = true
        try {
            const [userData, profileData] = await Promise.all([
                $fetch<{ email: string; createdAt: string | null }>('/api/auth/me'),
                $fetch<UserProfile>('/api/user/profile').catch(() => null)
            ])
            user.value = userData
            if (profileData) profile.value = profileData
        } catch (e) {
            console.error('Error fetching user data:', e)
        } finally {
            loading.value = false
        }
    }

    const updateProfile = async (data: UpdateUserProfileDTO) => {
        try {
            const updated = await $fetch<UserProfile>('/api/user/profile', {
                method: 'PUT',
                body: data
            })
            profile.value = updated
            return updated
        } catch (e) {
            console.error('Error updating profile:', e)
            throw e
        }
    }

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

    const logout = async () => {
        const config = useRuntimeConfig()
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
            // Limpiar todo el estado de la aplicación para evitar fugas entre sesiones
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
        loading, 
        fetchUser,
        updateProfile,
        logout
    }
}
