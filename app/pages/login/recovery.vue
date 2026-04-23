<script setup lang="ts">
const { t } = useI18n()
const { decryptMasterKey, encryptMasterKey, hashMasterPassword } = useCrypto()
const config = useRuntimeConfig()
const toast = useToast()

const step = ref(1)
const loading = ref(false)
const error = ref("")

// State
const email = ref("")
const recoveryKey = ref("")
const newPassword = ref("")
const confirmPassword = ref("")

// Fetched data
const fetchedData = ref<{
  recovery_protected_master_key: string
  recovery_key_iv: string
  recovery_key_salt: string
} | null>(null)

// Decrypted master key
const decryptedMasterKey = ref("")

const handleFetch = async () => {
  error.value = ""
  if (!email.value || !email.value.includes('@')) {
    error.value = "Por favor, introduce un correo electrónico válido."
    return
  }
  
  loading.value = true
  try {
    const res = await $fetch<{
      recovery_protected_master_key: string
      recovery_key_iv: string
      recovery_key_salt: string
    }>(`${config.public.apiBase}/api/auth/recovery/fetch`, {
      method: 'POST',
      body: { email: email.value.trim().toLowerCase() }
    })
    
    fetchedData.value = res
    step.value = 2
  } catch (e: any) {
    if (e?.response?.status === 404) {
      error.value = "No se encontró ningún usuario con ese correo o no tiene clave de recuperación configurada."
    } else {
      error.value = "Error al conectar con el servidor."
    }
  } finally {
    loading.value = false
  }
}

const handleDecrypt = async () => {
  error.value = ""
  if (!recoveryKey.value || !recoveryKey.value.startsWith('RK-')) {
    error.value = "La clave de recuperación no tiene un formato válido."
    return
  }
  
  loading.value = true
  try {
    if (!fetchedData.value) throw new Error("No data fetched")
    
    const mk = await decryptMasterKey(
      fetchedData.value.recovery_protected_master_key,
      recoveryKey.value.trim(),
      fetchedData.value.recovery_key_salt,
      fetchedData.value.recovery_key_iv
    )
    
    decryptedMasterKey.value = mk
    step.value = 3
  } catch (e) {
    error.value = "La clave de recuperación es incorrecta."
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  error.value = ""
  if (newPassword.value.length < 8) {
    error.value = "La contraseña debe tener al menos 8 caracteres."
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden."
    return
  }
  
  loading.value = true
  try {
    // 1. Hash de nueva contraseña
    const newPasswordHash = await hashMasterPassword(newPassword.value, email.value.trim().toLowerCase())
    
    // 2. Cifrar la MK con la nueva contraseña
    const protectedKeyData = await encryptMasterKey(
      decryptedMasterKey.value,
      newPassword.value
    )
    
    // 3. Enviar a reset
    await $fetch(`${config.public.apiBase}/api/auth/recovery/reset`, {
      method: 'POST',
      body: {
        email: email.value.trim().toLowerCase(),
        recovery_key: recoveryKey.value.trim(),
        new_password: newPasswordHash,
        protected_master_key: protectedKeyData.protected_master_key,
        master_key_iv: protectedKeyData.master_key_iv,
        master_key_salt: protectedKeyData.master_key_salt,
      }
    })
    
    toast.add({
      title: "Cuenta recuperada",
      description: "Tu contraseña maestra ha sido restablecida. Ya puedes iniciar sesión.",
      color: "success"
    })
    
    navigateTo('/login')
  } catch (e: any) {
    error.value = "Error al restablecer la contraseña."
  } finally {
    loading.value = false
  }
}

useHead(() => ({
  title: 'Recuperar Cuenta · Alcatraz',
}))
</script>

<template>
  <div class="relative min-h-screen login-bg text-white overflow-hidden flex items-center justify-center py-16">
    <UContainer class="w-full">
      <div class="mx-auto max-w-md relative z-10 w-full">
        <!-- HEADER BUTTON -->
        <UButton
          to="/login"
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-heroicons-arrow-left"
          class="mb-6 text-zinc-400 hover:text-emerald-400 transition-all pl-0"
        >
          <span class="font-mono uppercase text-[10px] tracking-widest">Volver al Login</span>
        </UButton>

        <UCard class="glass-card-dark" :ui="{ body: 'p-6 sm:p-8', header: 'p-0' }">
          <div class="text-center mb-8">
            <div class="mx-auto size-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <UIcon name="i-heroicons-lifebuoy" class="size-6 text-emerald-500" />
            </div>
            <h1 class="text-xl font-bold text-white uppercase tracking-widest">Recuperar Cuenta</h1>
            <p class="text-xs text-zinc-400 mt-2 font-mono">Paso {{ step }} de 3</p>
          </div>

          <UAlert v-if="error" color="error" variant="soft" title="Error" :description="error" class="mb-6" @close="error=''" />

          <!-- STEP 1 -->
          <form v-if="step === 1" @submit.prevent="handleFetch" class="space-y-6 auth-dark">
            <UFormField label="Correo Electrónico" :ui="{ label: 'text-xs uppercase tracking-wider text-zinc-400' }">
              <UInput v-model="email" type="email" placeholder="tu@correo.com" icon="i-heroicons-envelope" autofocus />
            </UFormField>
            
            <p class="text-xs text-zinc-500 leading-relaxed">
              Introduce el correo electrónico asociado a tu cuenta. Necesitaremos comprobar que tienes una configuración de recuperación activa.
            </p>

            <UButton block type="submit" :loading="loading" class="bg-emerald-500 hover:bg-emerald-400 text-black h-12 rounded-lg font-bold tracking-widest uppercase text-xs">
              Siguiente
            </UButton>
          </form>

          <!-- STEP 2 -->
          <form v-if="step === 2" @submit.prevent="handleDecrypt" class="space-y-6 auth-dark">
            <div class="p-4 bg-black/40 border border-zinc-800 rounded-lg text-center mb-4">
              <div class="text-[10px] text-zinc-500 font-mono uppercase mb-1">Cuenta localizada</div>
              <div class="text-sm font-bold text-zinc-300">{{ email }}</div>
            </div>

            <UFormField label="Clave de Recuperación" :ui="{ label: 'text-xs uppercase tracking-wider text-emerald-500' }">
              <UInput v-model="recoveryKey" type="text" placeholder="RK-XXXX-XXXX-XXXX-XXXX" icon="i-heroicons-key" autofocus />
            </UFormField>

            <p class="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
              Introduce la clave secreta que se te proporcionó al registrarte.
            </p>

            <UButton block type="submit" :loading="loading" class="bg-emerald-500 hover:bg-emerald-400 text-black h-12 rounded-lg font-bold tracking-widest uppercase text-xs">
              Descifrar Bóveda
            </UButton>
          </form>

          <!-- STEP 3 -->
          <form v-if="step === 3" @submit.prevent="handleReset" class="space-y-6 auth-dark">
            <UAlert color="success" variant="soft" title="Clave validada" description="Hemos logrado acceder a tu bóveda. Ahora puedes configurar una nueva contraseña maestra." class="mb-4" />

            <UFormField label="Nueva Contraseña Maestra" :ui="{ label: 'text-xs uppercase tracking-wider text-zinc-400' }">
              <UInput v-model="newPassword" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" autofocus />
            </UFormField>

            <UFormField label="Confirmar Contraseña" :ui="{ label: 'text-xs uppercase tracking-wider text-zinc-400' }">
              <UInput v-model="confirmPassword" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" />
            </UFormField>

            <UButton block type="submit" :loading="loading" class="bg-emerald-500 hover:bg-emerald-400 text-black h-12 rounded-lg font-bold tracking-widest uppercase text-xs">
              Restablecer Contraseña
            </UButton>
          </form>

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
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
.login-bg {
  isolation: isolate;
  background: linear-gradient(180deg, #0b0b0d, #121217 60%, #0b0b0d);
}

.auth-dark :deep(input) {
  background: #000;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.2s;
}

.auth-dark :deep(input:focus) {
  outline: none;
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}
</style>
