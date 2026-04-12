<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['update:open', 'enabled'])

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const { t } = useI18n()
const config = useRuntimeConfig()
const toast = useToast()
const { fetchUser } = useUser()

const step = ref(1)
const loading = ref(false)
const qrUri = ref('')
const secret = ref('')
const verificationCode = ref('')
const backupCodes = ref<string[]>([])
const errorMsg = ref('')

const startSetup = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/api/user/2fa/setup`, {
      method: 'POST',
      credentials: 'include'
    })
    qrUri.value = data.qr_uri
    secret.value = data.secret
    step.value = 2
  } catch (e: any) {
    errorMsg.value = e.data?.error || 'Error al iniciar configuración'
    toast.add({ title: 'Error', description: errorMsg.value, color: 'error' })
  } finally {
    loading.value = false
  }
}

const verifyAndEnable = async () => {
  if (verificationCode.value.length < 6) return
  loading.value = true
  errorMsg.value = ''
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/api/user/2fa/enable`, {
      method: 'POST',
      body: { 
        code: verificationCode.value,
        secret: secret.value
      },
      credentials: 'include'
    })
    backupCodes.value = data.backup_codes
    step.value = 3
    await fetchUser() // Actualizar estado global del usuario
    emit('enabled')
  } catch (e: any) {
    errorMsg.value = e.data?.error || 'Código incorrecto'
    toast.add({ title: 'Error', description: errorMsg.value, color: 'error' })
  } finally {
    loading.value = false
  }
}

const copyBackupCodes = () => {
  const text = backupCodes.value.join('\n')
  navigator.clipboard.writeText(text)
  toast.add({ title: 'Copiado', description: 'Códigos copiados al portapapeles', color: 'success' })
}

const downloadBackupCodes = () => {
  const text = `ALCATRAZ BACKUP CODES\nGuardar en un lugar seguro\n\n${backupCodes.value.join('\n')}`
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'alcatraz_backup_codes.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const finish = () => {
  isOpen.value = false
  // Reset state
  setTimeout(() => {
    step.value = 1
    qrUri.value = ''
    secret.value = ''
    verificationCode.value = ''
    backupCodes.value = []
  }, 300)
}
</script>

<template>
  <UModal v-model:open="isOpen" :prevent-close="step === 3">
    <template #content>
      <div class="p-8 bg-black border border-emerald-500/20 rounded-2xl max-w-md mx-auto shadow-2xl overflow-hidden relative">
        <!-- Decoration -->
        <div class="absolute -top-24 -right-24 size-48 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none" />
        
        <!-- STEP 1: Introduction -->
        <div v-if="step === 1" class="text-center animate-fade-in">
          <div class="size-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UIcon name="i-heroicons-shield-check" class="size-8 text-emerald-500" />
          </div>
          <h3 class="text-xl font-bold text-white uppercase tracking-widest mb-4">{{ $t('auth.setup.title') }}</h3>
          <p class="text-sm text-zinc-500 leading-relaxed mb-8">
            {{ $t('auth.setup.desc') }}
          </p>
          <UButton 
            block 
            class="bg-emerald-500 hover:bg-emerald-400 text-black h-12 rounded-xl font-bold uppercase tracking-widest text-xs"
            :loading="loading"
            @click="startSetup"
          >
            {{ $t('auth.setup.button') }}
          </UButton>
        </div>

        <!-- STEP 2: QR & Verification -->
        <div v-if="step === 2" class="animate-fade-in">
          <h3 class="text-lg font-bold text-white uppercase tracking-widest mb-6 text-center">{{ $t('auth.setup.scan') }}</h3>
          
          <div class="bg-white p-4 rounded-xl mx-auto mb-8 w-fit shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <QrcodeVue :value="qrUri" :size="180" level="H" />
          </div>

          <div class="space-y-4 mb-8">
            <p class="text-[10px] text-zinc-500 uppercase tracking-widest text-center">
              {{ $t('auth.setup.manual') }} <code class="text-emerald-400 font-mono">{{ secret }}</code>
            </p>
            
            <UFormField :label="$t('auth.setup.verify')" :ui="{ label: 'label-tech' }">
              <UInput 
                v-model="verificationCode" 
                placeholder="000000" 
                maxlength="6"
                class="text-center font-mono tracking-[0.5em]"
                :ui="{ base: 'input-tech h-12 text-center text-xl font-bold' }"
                @keyup.enter="verifyAndEnable"
              />
            </UFormField>
          </div>

          <div class="flex flex-col gap-3">
            <UButton 
              block 
              class="bg-emerald-500 hover:bg-emerald-400 text-black h-12 rounded-xl font-bold uppercase tracking-widest text-xs"
              :loading="loading"
              :disabled="verificationCode.length < 6"
              @click="verifyAndEnable"
            >
              {{ $t('auth.setup.activate') }}
            </UButton>
            <UButton 
              variant="ghost" 
              color="neutral" 
              class="text-zinc-600 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest"
              @click="step = 1"
            >
              {{ $t('auth.setup.back') }}
            </UButton>
          </div>
        </div>

        <!-- STEP 3: Backup Codes -->
        <div v-if="step === 3" class="animate-fade-in">
          <div class="text-center mb-6">
            <UIcon name="i-heroicons-check-circle" class="size-12 text-emerald-500 mb-4" />
            <h3 class="text-lg font-bold text-white uppercase tracking-widest mb-2">{{ $t('auth.setup.enabled') }}</h3>
            <p class="text-[10px] text-red-500 font-bold uppercase tracking-widest leading-relaxed">
              {{ $t('auth.setup.important') }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-8 bg-zinc-950 p-6 rounded-xl border border-zinc-900 font-mono text-zinc-300 relative overflow-hidden">
            <div v-for="code in backupCodes" :key="code" class="text-center py-1 text-sm tracking-wider">
              {{ code }}
            </div>
            <!-- Grain effect -->
            <div class="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>

          <div class="flex gap-3 mb-6">
            <UButton 
              block 
              variant="soft" 
              color="neutral"
              icon="i-heroicons-document-duplicate"
              class="flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest"
              @click="copyBackupCodes"
            >
              {{ $t('auth.setup.copy') }}
            </UButton>
            <UButton 
              block 
              variant="soft" 
              color="neutral"
              icon="i-heroicons-arrow-down-tray"
              class="flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest"
              @click="downloadBackupCodes"
            >
              {{ $t('auth.setup.download') }}
            </UButton>
          </div>

          <UButton 
            block 
            class="bg-white hover:bg-emerald-400 text-black h-12 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
            @click="finish"
          >
            {{ $t('auth.setup.finish') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.label-tech {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #52525b;
}

.input-tech {
  background: #09090b !important;
  border: 1px solid #18181b !important;
  border-radius: 8px !important;
  color: #d4d4d8 !important;
  transition: all 0.3s ease !important;
}

.input-tech:focus-within {
  border-color: rgba(16, 185, 129, 0.3) !important;
}
</style>
