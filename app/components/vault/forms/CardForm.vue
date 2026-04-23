<script setup lang="ts">
import { z } from 'zod'
import FormLayout from './FormLayout.vue';

const emit = defineEmits(['back', 'save'])

const props = defineProps<{
  initialData?: any
}>()

const schema = z.object({
  title: z.string().min(1, 'El nombre es requerido'),
  holder: z.string(),
  number: z.string().max(16, 'El número de la tarjeta debe tener 16 dígitos').min(16, 'El número de la tarjeta debe tener 16 dígitos'),
  expiry: z.string().max(5, 'La fecha de expiración debe tener 5 dígitos').min(5, 'La fecha de expiración debe tener 5 dígitos'),
  cvv: z.number().max(3, 'El CVV debe tener 3 dígitos').min(3, 'El CVV debe tener 3 dígitos'),
  folder: z.string()
})

const { folders: rawFolders } = useVault()
const folderOptions = computed(() => rawFolders.value.map(f => ({
  label: f.name,
  value: f.id
})))

const defaultFolderId = computed(() => rawFolders.value.find(f => f.is_default)?.id || 'personal')

const state = reactive({
  title: props.initialData?.title || '',
  holder: props.initialData?.holder || '',
  number: props.initialData?.number || '',
  expiry: props.initialData?.expiry || '',
  cvv: props.initialData?.cvv || '',
  folder: props.initialData?.folder || defaultFolderId.value
})

const isFlipped = ref(false)

const cardBrand = computed(() => {
  const num = state.number.replace(/\D/g, '')
  if (num.match(/^4/)) return 'visa'
  if (num.match(/^5[1-5]/)) return 'mastercard'
  return 'unknown'
})

const displayBrand = computed(() => {
  if (cardBrand.value === 'visa') return 'VISA'
  if (cardBrand.value === 'mastercard') return 'Mastercard'
  return 'Alcatraz Titanium'
})

const displayCardNumber = computed(() => {
  const clean = state.number.replace(/\D/g, '').slice(0, 16)
  if (!clean) return '0000 0000 0000 0000'
  return clean.match(/.{1,4}/g)?.join(' ') || ''
})

function handleSaveLayout() {
  emit('save', { ...state })
}
</script>

<template>
  <FormLayout :title="initialData ? 'Editar Tarjeta' : 'Nueva Tarjeta'" :can-save="true" :is-editing="!!initialData"
    @back="emit('back')" @save="handleSaveLayout">
    <div class="flex flex-col gap-10">

      <!-- Interactive Preview (Top) -->
      <div class="w-full max-w-sm mx-auto flex flex-col gap-4">
        <div class="relative w-full aspect-[1.586/1] card-flip-container" :class="{ 'is-flipped': isFlipped }">
          <div class="card-flipper shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[20px] ring-1 ring-white/10">
            
            <!-- FRONT FACE -->
            <div class="card-face card-front bg-[#080808]">
              <!-- Texture & Noise (Clipped) -->
              <div class="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none">
                <div class="absolute inset-0 bg-linear-to-br from-[#1a1c1a] via-black to-[#050f08] opacity-90"></div>
                <div class="absolute -top-1/2 -right-1/2 w-[150%] h-[150%] bg-green-500/10 blur-[100px] rounded-full mix-blend-overlay pointer-events-none"></div>
              </div>

              <div class="relative z-10 p-6 flex flex-col justify-between h-full">
                <div class="flex justify-between items-start">
                  <div class="text-[10px] font-bold tracking-[0.2em] text-white/50 font-mono uppercase">{{ displayBrand }}</div>
                  <UIcon name="i-heroicons-wifi" class="size-6 rotate-90 text-white/30" />
                </div>

                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <!-- Premium Chip -->
                    <div class="w-10 h-7 rounded-md bg-linear-to-tr from-[#d4af37]/20 to-[#f9d976]/20 border border-[#d4af37]/40 flex items-center justify-center relative overflow-hidden backdrop-blur-sm shadow-inner">
                      <div class="absolute inset-0 bg-linear-to-b from-white/10 to-transparent"></div>
                      <div class="w-full h-px bg-[#d4af37]/30 absolute top-1/3"></div>
                      <div class="w-full h-px bg-[#d4af37]/30 absolute bottom-1/3"></div>
                      <div class="h-full w-px bg-[#d4af37]/30 absolute left-1/3"></div>
                      <div class="h-full w-px bg-[#d4af37]/30 absolute right-1/3"></div>
                    </div>
                    <UIcon name="i-heroicons-signal" class="size-4 text-white/20 rotate-90" />
                  </div>

                  <div class="font-mono text-xl tracking-[0.14em] text-white/90 drop-shadow-lg truncate">
                    {{ displayCardNumber }}
                  </div>
                </div>

                <div class="flex justify-between items-end text-neutral-400 mt-2">
                  <div class="max-w-[70%]">
                    <div class="text-[8px] uppercase tracking-widest mb-0.5 opacity-50 font-bold">Titular</div>
                    <div class="font-medium uppercase tracking-widest text-xs text-neutral-200 truncate">{{ state.holder || 'NOMBRE APELLIDO' }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-[8px] uppercase tracking-widest mb-0.5 opacity-50 font-bold">Expira</div>
                    <div class="font-mono text-xs text-neutral-200 tracking-wider">{{ state.expiry || 'MM/AA' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- BACK FACE -->
            <div class="card-face card-back bg-[#080808]">
              <!-- Texture (Clipped) -->
              <div class="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none">
                <div class="absolute inset-0 bg-linear-to-bl from-[#1a1c1a] via-black to-[#050f08] opacity-90"></div>
              </div>

              <div class="relative z-10 flex flex-col h-full py-6">
                <!-- Magnetic Strip -->
                <div class="w-full h-10 bg-black/95 mb-4 relative overflow-hidden shadow-inner">
                  <div class="absolute inset-0 bg-noise opacity-20"></div>
                </div>

                <!-- Signature & CVC -->
                <div class="px-6 space-y-2">
                  <div class="flex gap-4 items-center">
                    <div class="flex-1 h-8 bg-white/10 rounded-sm flex items-center px-4 overflow-hidden relative">
                      <div class="absolute inset-0 bg-repeating-linear-to-r from-transparent via-white/5 to-transparent bg-size-[4px_4px]"></div>
                      <span class="font-handwriting text-black/40 text-sm transform -rotate-1 translate-y-0.5 select-none" style="font-family: 'Brush Script MT', cursive; filter: invert(1);">{{ state.holder }}</span>
                    </div>
                    <div class="w-12 h-8 bg-white rounded-sm flex items-center justify-center text-black font-mono font-bold tracking-widest text-sm shadow-inner">
                      {{ state.cvv || '123' }}
                    </div>
                  </div>
                  <span class="text-[8px] text-white/30 uppercase tracking-widest block text-right pr-1">Código de seguridad</span>
                </div>

                <div class="mt-auto px-6 flex justify-between items-center opacity-30">
                  <UIcon name="i-heroicons-globe-alt" class="size-6" />
                  <span class="text-[8px] tracking-widest uppercase">Alcatraz Secure Vault</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center opacity-60 flex items-center justify-center gap-2">
          <UIcon name="i-heroicons-viewfinder-circle" class="size-4" />
          <p class="text-[10px] uppercase tracking-widest font-bold">Vista previa interactiva</p>
        </div>
      </div>

      <!-- Form (Bottom) -->
      <div class="w-full flex flex-col gap-6">
        <UForm :schema="schema" :state="state" class="space-y-5">
          <UFormField label="Nombre descriptivo" name="title">
            <UInput v-model="state.title" placeholder="Ej. Visa Oro" icon="i-heroicons-tag" variant="none"
              class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
              autocomplete="off" />
          </UFormField>

          <div class="space-y-5">
            <UFormField label="Número de tarjeta" name="number">
              <UInput v-model="state.number" placeholder="0000 0000 0000 0000" icon="i-heroicons-credit-card"
                variant="none"
                class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
                autocomplete="off" />
            </UFormField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <UFormField label="Titular de la tarjeta" name="holder">
                <UInput v-model="state.holder" placeholder="NOMBRE APELLIDO" icon="i-heroicons-user" variant="none"
                  class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
                  autocomplete="off" />
              </UFormField>

              <UFormField label="Categoría" name="folder">
                <USelect v-model="state.folder" :items="folderOptions" variant="none"
                  class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
                  icon="i-heroicons-folder" />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-5">
              <UFormField label="Expiración" name="expiry">
                <UInput v-model="state.expiry" placeholder="MM/AA" variant="none"
                  class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
                  autocomplete="off" />
              </UFormField>
              <UFormField label="CVV / CVC" name="cvv">
                <UInput v-model="state.cvv" placeholder="123" type="password" variant="none"
                  class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
                  autocomplete="off" @focus="isFlipped = true" @blur="isFlipped = false" />
              </UFormField>
            </div>
          </div>

          <div class="rounded-xl bg-white/5 p-4 border border-white/5 flex gap-4 items-start pt-6 mt-4">
            <div class="p-2 bg-white/5 rounded-lg">
              <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h4 class="text-sm font-medium text-white mb-1">Datos financieros protegidos</h4>
              <p class="text-xs text-neutral-400 leading-relaxed">
                Tu información se cifra con cifrado militar localmente antes de guardarse en el servidor.
              </p>
            </div>
          </div>
        </UForm>
      </div>

    </div>
  </FormLayout>
</template>

<style scoped>
/* Hardened 3D CSS Setup for Safari & Chrome */
.card-flip-container {
  perspective: 1500px;
}
.card-flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
  transform-style: preserve-3d;
}
.card-flip-container.is-flipped .card-flipper {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  border-radius: 20px;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.card-front {
  transform: rotateY(0deg);
  z-index: 2;
}
.card-back {
  transform: rotateY(180deg);
}

.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>
