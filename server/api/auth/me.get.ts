export default defineEventHandler((event) => {
    const token = getCookie(event, 'auth_token')
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
    }

    try {
        // Decode the JWT payload without verification (Go backend handles auth)
        const parts = token.split('.')
        if (parts.length !== 3) {
            throw new Error('Invalid token format')
        }

        const payload = JSON.parse(
            atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
        )

        return {
            email: payload.email || payload.sub || '',
            createdAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : null
        }
    } catch {
        throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }
})
