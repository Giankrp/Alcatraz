export default defineEventHandler((event) => {
    const token = getCookie(event, 'auth_token')
    return { authenticated: !!token }
})
