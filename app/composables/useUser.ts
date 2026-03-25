export const useUser = () => {
    const user = useState<{ email: string; createdAt: string | null } | null>('user-data', () => null)
    const loading = useState('user-loading', () => false)

    const fetchUser = async () => {
        if (user.value) return // Already fetched
        loading.value = true
        try {
            const data = await $fetch<{ email: string; createdAt: string | null }>('/api/auth/me')
            user.value = data
        } catch {
            user.value = null
        } finally {
            loading.value = false
        }
    }

    const email = computed(() => user.value?.email || '')

    const initials = computed(() => {
        const e = email.value
        if (!e) return '?'
        // Use first two chars of the email local part
        const local = e.split('@')[0] || ''
        return local.slice(0, 2).toUpperCase()
    })

    // Generate a consistent color from email hash
    const avatarColor = computed(() => {
        const e = email.value
        if (!e) return 'hsl(160, 60%, 40%)'
        let hash = 0
        for (let i = 0; i < e.length; i++) {
            hash = e.charCodeAt(i) + ((hash << 5) - hash)
        }
        const hue = Math.abs(hash) % 360
        return `hsl(${hue}, 55%, 45%)`
    })

    const createdAt = computed(() => user.value?.createdAt || null)

    return { user, email, initials, avatarColor, createdAt, loading, fetchUser }
}
