export default defineNuxtRouteMiddleware(async () => {
    const { data } = await useFetch("/api/auth/check")
    if (data.value?.authenticated) {
        return navigateTo("/login/unlock")
    }
})
