<script setup lang="ts">
const { twoFactorTempToken, twoFactorEmail } = useUser()
const { setMasterKey, twoFactorPendingPassword, clearTwoFactorPendingPassword } = useMasterPassword()
const { decryptMasterKey } = useCrypto()
const { t } = useI18n()
const config = useRuntimeConfig()
const toast = useToast()

definePageMeta({
  middleware: "guest"
})

useHead(() => ({
  title: t('auth.2fa.title') + ' · Alcatraz',
}))

const code = ref('')
const isBackupCode = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

onMounted(() => {
  if (!twoFactorTempToken.value || !twoFactorPendingPassword.value) {
    navigateTo('/login')
  }
})

const onVerify = async () => {
  if (!code.value || code.value.length < 6) return

  isLoading.value = true
  errorMsg.value = ''

  try {
    const response = await $fetch<any>(`${config.public.apiBase}/api/auth/2fa/verify`, {
      method: 'POST',
      body: { code: code.value },
      headers: {
        'X-Temp-Token': twoFactorTempToken.value || ''
      },
      credentials: 'include'
    })

    // Descifrar la Master Key con el password almacenado temporalmente
    if (twoFactorPendingPassword.value && response.protected_master_key) {
      const masterKey = await decryptMasterKey(
        response.protected_master_key,
        twoFactorPendingPassword.value,
        response.master_key_salt,
        response.master_key_iv,
      )
      setMasterKey(masterKey)
    }

    // Limpiar estado temporal
    clearTwoFactorPendingPassword()
    twoFactorTempToken.value = null
    twoFactorEmail.value = null

    toast.add({
      title: t('auth.2fa.success'),
      description: t('login.alerts.successDesc'),
      color: 'success'
    })

    navigateTo('/boveda')
  } catch (e: any) {
    console.error('2FA Verification failed:', e)
    errorMsg.value = e.data?.error || 'Código inválido o expirado'
    toast.add({
      title: t('login.alerts.error'),
      description: errorMsg.value,
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const toggleMode = () => {
  isBackupCode.value = !isBackupCode.value
  code.value = ''
  errorMsg.value = ''
}
</script>

<template>
  <div class="relative min-h-screen login-bg text-white overflow-hidden grid place-items-center py-16">
    <!-- Animated background bubbles (matching login) -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <span class="bubble bubble-1"></span>
      <span class="bubble bubble-2"></span>
      <span class="bubble bubble-3"></span>
      <span class="bubble bubble-4"></span>
    </div>

    <UContainer>
      <div class="mx-auto max-w-sm relative z-10">
        <UCard class="glass-card-dark transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.1)]"
          :ui="{ body: 'p-8 sm:p-10', header: 'p-0' }">
          
          <div class="text-center mb-10">
            <div class="size-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <UIcon :name="isBackupCode ? 'i-heroicons-shield-exclamation' : 'i-heroicons-shield-check'" class="size-8 text-emerald-500" />
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-white mb-2 uppercase tracking-widest">
              {{ isBackupCode ? $t('auth.2fa.backup') : $t('auth.2fa.title') }}
            </h1>
            <p class="text-xs text-zinc-500 uppercase tracking-widest font-mono">
              {{ twoFactorEmail }}
            </p>
          </div>

          <form @submit.prevent="onVerify" class="space-y-8">
            <div class="space-y-2">
              <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600 mb-4 text-center">
                {{ isBackupCode ? $t('auth.2fa.backupHelp') : $t('auth.2fa.totpHelp') }}
              </p>
              
              <UInput 
                v-model="code"
                :type="isBackupCode ? 'text' : 'text'"
                :placeholder="isBackupCode ? 'ABC123XY' : '000 000'"
                :maxlength="isBackupCode ? 8 : 6"
                class="text-center text-xl tracking-[0.5em] font-mono input-2fa"
                :ui="{ base: 'input-tech h-16 text-center text-2xl font-bold rounded-xl border-zinc-800 bg-black/40' }"
                autofocus
                autocomplete="one-time-code"
              />
              
              <p v-if="errorMsg" class="text-[10px] text-red-500 font-mono uppercase text-center mt-2 animate-pulse">
                {{ errorMsg }}
              </p>
            </div>

            <UButton 
              type="submit"
              block
              :loading="isLoading"
              :disabled="!code || (isBackupCode ? code.length < 8 : code.length < 6)"
              class="bg-emerald-500 hover:bg-emerald-400 text-black h-14 rounded-xl font-bold tracking-[0.3em] uppercase text-xs shadow-[0_4px_20px_rgba(16,185,129,0.2)] transition-all active:scale-95 cursor-pointer"
            >
              {{ $t('auth.2fa.verify') }}
            </UButton>

            <div class="pt-4 border-t border-white/5">
              <button 
                type="button" 
                @click="toggleMode"
                class="w-full text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 hover:text-emerald-400 transition-colors py-2 cursor-pointer"
              >
                {{ isBackupCode ? $t('auth.2fa.totp') : $t('auth.2fa.backup') }}
              </button>
            </div>
          </form>

          <template #footer>
            <div class="flex justify-center pt-2">
              <ULink to="/login" class="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700 hover:text-white transition-colors">
                {{ $t('profile.danger.cancel') }}
              </ULink>
            </div>
          </template>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.glass-card-dark {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.login-bg {
  background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent 40%),
              radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.03), transparent 40%),
              #09090b;
}

.bubble {
  position: absolute;
  border-radius: 9999px;
  filter: blur(60px);
  background: rgba(16, 185, 129, 0.1);
  mix-blend-mode: screen;
  animation: float 20s ease-in-out infinite;
}

.bubble-1 { width: 300px; height: 300px; top: -100px; left: -50px; }
.bubble-2 { width: 400px; height: 400px; bottom: -200px; right: -50px; animation-delay: -5s; }
.bubble-3 { width: 250px; height: 250px; top: 40%; left: 60%; animation-delay: -10s; }

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.input-tech {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

.input-tech:focus-within {
  border-color: rgba(16, 185, 129, 0.5) !important;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.1) !important;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
