<script setup lang="ts">
const { data: session, status, signOut } = useAuth()
const { setMasterPassword, userEmail, clearMasterPassword, clearUserEmail } = useMasterPassword()

const route = useRoute()
const config = useRuntimeConfig()

const isRegisterMode = ref(route.query.mode === 'register')
const checkingUser = ref(false)

const masterPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

// Verificar si hay sesión del backend (auth_token cookie) — cubre usuarios sin provider
const { data: backendAuth } = await useFetch('/api/auth/check')
const hasBackendSession = computed(() => !!backendAuth.value?.authenticated)

// El usuario está autenticado si tiene sesión OAuth O sesión del backend
const isAuthenticated = computed(() => {
  return status.value === 'authenticated' || hasBackendSession.value
})

useHead({
  title: computed(() => isRegisterMode.value ? 'Crear contraseña maestra' : 'Desbloquear bóveda'),
  meta: [
    { name: 'description', content: 'Introduce tu contraseña maestra para acceder a tu bóveda segura.' },
    { property: 'og:title', content: 'Desbloquear bóveda — Alcatraz' }
  ]
})

// Si no hay ninguna sesión activa (ni OAuth ni backend), redirigir a login
watch([() => status.value, hasBackendSession], () => {
  // Esperar a que OAuth termine de cargar antes de decidir
  if (status.value === 'loading') return

  if (!isAuthenticated.value) {
    navigateTo('/login')
  }
}, { immediate: true })

// Email: preferir sesión OAuth, fallback al email almacenado en memoria
const email = computed(() => session.value?.user?.email ?? userEmail.value ?? '')

// Auto-detectar si el usuario necesita registrarse
watch(email, async (newEmail) => {
  if (!newEmail) return

  checkingUser.value = true
  try {
    const res = await $fetch<{ exists: boolean }>(`${config.public.apiBase}/api/auth/exists`, {
      params: { email: newEmail },
      credentials: 'include'
    })
    isRegisterMode.value = !res.exists
  } catch (err) {
    console.error('Error checking user existence:', err)
    // Mantener el valor del query param como fallback
  } finally {
    checkingUser.value = false
  }
}, { immediate: true })

const onSubmit = async () => {
  if (!masterPassword.value || masterPassword.value.length < 8) {
    error.value = 'La contraseña maestra debe tener al menos 8 caracteres.'
    return
  }

  if (isRegisterMode.value && masterPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    if (isRegisterMode.value) {
      // 1. Registrar la cuenta en el backend
      await $fetch(`${config.public.apiBase}/api/auth/register`, {
        method: 'POST',
        body: {
          email: email.value,
          password: masterPassword.value
        },
        credentials: 'include'
      })
    }

    // 2. Login (tanto para registro como para login normal)
    await $fetch<any>(`${config.public.apiBase}/api/auth/login`, {
      method: 'POST',
      body: {
        email: email.value,
        password: masterPassword.value
      },
      credentials: 'include'
    })

    setMasterPassword(masterPassword.value)
    navigateTo('/boveda')
  } catch (err: any) {
    console.error('Unlock failed:', err)
    if (isRegisterMode.value) {
      error.value = err?.data?.message || 'Error al crear la cuenta. Puede que ya exista una cuenta con ese email.'
    } else {
      error.value = err?.data?.message || 'Credenciales incorrectas. Verifica tu contraseña maestra.'
    }
  } finally {
    loading.value = false
  }
}

const handleSignOut = async () => {
  const { clearVault } = useVault()
  clearMasterPassword()
  clearUserEmail()
  clearVault()
  
  try {
    await $fetch(`${config.public.apiBase}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  } catch (err) {
    console.error('Backend logout failed:', err)
  }

  // Clear NuxtAuth session and redirect
  await signOut({ callbackUrl: '/login', redirect: true })
}


</script>

<template>
  <div class="relative min-h-screen login-bg text-white overflow-hidden grid place-items-center py-16">
    <div class="absolute inset-0 z-0 overflow-hidden">
      <span class="bubble bubble-1"></span>
      <span class="bubble bubble-2"></span>
      <span class="bubble bubble-3"></span>
      <span class="bubble bubble-4"></span>
      <span class="bubble bubble-5"></span>
      <span class="bubble bubble-6"></span>
    </div>

    <UContainer>
      <div class="mx-auto max-w-md relative z-10">
        <UCard class="glass-card-dark transition-all duration-300 hover:shadow-2xl"
          :ui="{ body: 'p-6 sm:p-8', header: 'p-0' }">

          <!-- Loading while checking user -->
          <div v-if="checkingUser" class="flex flex-col items-center justify-center py-12 gap-4">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-white/60 animate-spin" />
            <p class="text-sm text-white/50">Verificando cuenta...</p>
          </div>

          <template v-else>
            <!-- Header -->
            <div class="text-center mb-6">
              <div
                class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur mb-4">
                <UIcon :name="isRegisterMode ? 'i-heroicons-shield-check' : 'i-heroicons-lock-closed'"
                  class="w-7 h-7 text-white" />
              </div>
              <h1 class="text-xl font-semibold">
                {{ isRegisterMode ? 'Crear contraseña maestra' : 'Desbloquear bóveda' }}
              </h1>
              <p class="text-sm text-white/60 mt-1">
                {{ isRegisterMode
                  ? 'Elige una contraseña maestra para cifrar tu bóveda'
                  : 'Introduce tu contraseña maestra para continuar' }}
              </p>
            </div>

            <!-- Email display -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-white/70 mb-1.5">Cuenta</label>
              <div class="flex items-center gap-2 px-3 py-2.5 rounded-md bg-white/5 border border-white/10">
                <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-white/50 shrink-0" />
                <span class="text-sm text-white/80 truncate">{{ email || 'Cargando...' }}</span>
                <UIcon name="i-heroicons-check-badge" class="w-4 h-4 text-green-400 shrink-0 ml-auto" />
              </div>
            </div>

            <!-- Error alert -->
            <UAlert v-if="error" color="error" variant="soft" :title="error" class="mb-4" @close="error = ''" />

            <!-- Master password form -->
            <form @submit.prevent="onSubmit" class="space-y-4">
              <div>
                <label for="master-password" class="block text-sm font-medium text-white/70 mb-1.5">
                  Contraseña maestra
                </label>
                <input id="master-password" v-model="masterPassword" type="password" placeholder="••••••••"
                  autocomplete="new-password" required
                  class="w-full px-3 py-2.5 rounded-md bg-black border border-white/25 text-white placeholder-white/55 focus:outline-none focus:ring-2 focus:ring-white/20 transition-shadow" />
              </div>

              <!-- Confirm password (solo en modo registro) -->
              <div v-if="isRegisterMode">
                <label for="confirm-password" class="block text-sm font-medium text-white/70 mb-1.5">
                  Confirmar contraseña maestra
                </label>
                <input id="confirm-password" v-model="confirmPassword" type="password" placeholder="••••••••"
                  autocomplete="new-password" required
                  class="w-full px-3 py-2.5 rounded-md bg-black border border-white/25 text-white placeholder-white/55 focus:outline-none focus:ring-2 focus:ring-white/20 transition-shadow" />
              </div>

              <p class="text-xs text-white/40">
                {{ isRegisterMode
                  ? 'Esta contraseña NO se puede recuperar. Es la única clave para descifrar tu bóveda.'
                  : 'Tu contraseña maestra nunca se envía a terceros. Solo se usa para descifrar tu bóveda.' }}
              </p>

              <UButton type="submit" :loading="loading" :disabled="!email || loading"
                :label="isRegisterMode ? 'Crear cuenta y acceder' : 'Desbloquear'"
                :icon="isRegisterMode ? 'i-heroicons-shield-check' : 'i-heroicons-lock-open'" color="neutral"
                variant="solid" block size="lg" class="btn btn-lg" />
            </form>

            <!-- Footer -->
            <div class="mt-5 pt-4 border-t border-white/10 text-center">
              <p class="text-sm text-white/50">
                {{ isRegisterMode ? '¿Ya tienes cuenta?' : '¿Otra cuenta?' }}
                <button type="button" @click="handleSignOut" class="font-medium text-white/80 hover:text-white cursor-pointer ml-1 transition-colors">
                  Volver al login
                </button>
              </p>
            </div>

          </template>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.glass-card-dark {
  position: relative;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(24px) saturate(120%);
  -webkit-backdrop-filter: blur(24px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.glass-card-dark {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.glass-card-dark::before {
  content: "";
  position: absolute;
  inset: -30% -10% auto -10%;
  height: 200px;
  background: radial-gradient(120px 60px at 20% 50%, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0));
  filter: blur(24px);
  transform: translate3d(0, 0, 0);
  animation: glassShift 12s ease-in-out infinite;
}

.glass-card-dark::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.bubble {
  position: absolute;
  border-radius: 9999px;
  filter: blur(12px);
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.2));
  mix-blend-mode: screen;
  opacity: 0.85;
  animation: float 14s ease-in-out infinite;
}

.login-bg {
  isolation: isolate;
  background:
    radial-gradient(1000px 500px at 10% 10%, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0)),
    radial-gradient(800px 400px at 80% 20%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0)),
    linear-gradient(180deg, #0b0b0d, #121217 60%, #0b0b0d);
}

.bubble-1 {
  width: 220px;
  height: 220px;
  top: 6%;
  left: 8%;
  animation-duration: 12s;
}

.bubble-2 {
  width: 160px;
  height: 160px;
  top: 18%;
  right: 8%;
  animation-duration: 10s;
  animation-delay: 0.6s;
}

.bubble-3 {
  width: 280px;
  height: 280px;
  bottom: 6%;
  left: 4%;
  animation-duration: 14s;
  animation-delay: 1.2s;
}

.bubble-4 {
  width: 180px;
  height: 180px;
  bottom: 12%;
  right: 10%;
  animation-duration: 11s;
  animation-delay: 1.8s;
}

.bubble-5 {
  width: 120px;
  height: 120px;
  top: 48%;
  left: 44%;
  animation-duration: 9s;
  animation-delay: 0.3s;
}

.bubble-6 {
  width: 200px;
  height: 200px;
  top: 68%;
  right: 38%;
  animation-duration: 13s;
  animation-delay: 1.1s;
}

@keyframes float {

  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.75;
  }

  20% {
    transform: translate3d(24px, -28px, 0) scale(1.03);
    opacity: 0.85;
  }

  50% {
    transform: translate3d(-20px, 18px, 0) scale(1.07);
    opacity: 0.7;
  }

  80% {
    transform: translate3d(16px, -12px, 0) scale(1.02);
    opacity: 0.8;
  }
}

@keyframes glassShift {

  0%,
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 0.9;
  }

  50% {
    transform: translate3d(20px, -10px, 0);
    opacity: 0.75;
  }
}
</style>
