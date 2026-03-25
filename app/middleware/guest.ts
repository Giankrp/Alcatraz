export default defineNuxtRouteMiddleware(async (to, from) => {
    const { data } = await useFetch("/api/auth/check")
    if (data.value?.authenticated) {
        return navigateTo("/boveda")
    }
})
