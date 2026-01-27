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

const state = reactive({
  title: props.initialData?.title || '',
  holder: props.initialData?.holder || '',
  number: props.initialData?.number || '',
  expiry: props.initialData?.expiry || '',
  cvv: props.initialData?.cvv || '',
  folder: props.initialData?.folder || 'personal'
})

const folders = [
  { label: 'Personal', value: 'personal' },
  { label: 'Trabajo', value: 'work' },
  { label: 'Finanzas', value: 'finance' }
]

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

function handleSaveLayout() {
  emit('save', { ...state })
}
</script>

<template>
  <FormLayout :title="initialData ? 'Editar Tarjeta' : 'Nueva Tarjeta'" :can-save="true" :is-editing="!!initialData"
    @back="emit('back')" @save="handleSaveLayout">
    <div class="flex flex-col xl:flex-row gap-8 xl:gap-12">

      <!-- Left Column: Form -->
      <div class="flex-1 order-2 xl:order-1">
        <UForm :schema="schema" :state="state" class="space-y-6">
          <UFormGroup label="Nombre descriptivo" name="title">
            <UInput v-model="state.title" placeholder="Ej. Visa Oro" icon="i-heroicons-tag" variant="none"
              class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
              autocomplete="off" />
          </UFormGroup>

          <div class="space-y-6">
            <UFormGroup label="Número de tarjeta" name="number">
              <UInput v-model="state.number" placeholder="0000 0000 0000 0000" icon="i-heroicons-credit-card"
                variant="none"
                class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
                autocomplete="off" />
            </UFormGroup>

            <div class="grid grid-cols-2 gap-6">
              <UFormGroup label="Titular de la tarjeta" name="holder">
                <UInput v-model="state.holder" placeholder="NOMBRE APELLIDO" icon="i-heroicons-user" variant="none"
                  class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
                  autocomplete="off" />
              </UFormGroup>

              <UFormGroup label="Categoría" name="folder">
                <USelect v-model="state.folder" :options="folders" variant="none"
                  class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
                  icon="i-heroicons-folder" />
              </UFormGroup>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <UFormGroup label="Expiración" name="expiry">
                <UInput v-model="state.expiry" placeholder="MM/AA" variant="none"
                  class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
                  autocomplete="off" />
              </UFormGroup>
              <UFormGroup label="CVV / CVC" name="cvv">
                <UInput v-model="state.cvv" placeholder="123" type="password" variant="none"
                  class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
                  autocomplete="off" @focus="isFlipped = true" @blur="isFlipped = false" />
              </UFormGroup>
            </div>
          </div>

          <div class="rounded-xl bg-white/5 p-4 border border-white/5 flex gap-4 items-start">
            <div class="p-2 bg-white/5 rounded-lg">
              <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 class="text-sm font-medium text-white mb-1">Datos financieros protegidos</h4>
              <p class="text-xs text-gray-400 leading-relaxed">
                La información se cifra localmente antes de guardarse. Solo tú tienes la llave maestra.
              </p>
            </div>
          </div>
        </UForm>
      </div>

      <!-- Right Column: Interactive Preview -->
      <div class="w-full xl:w-96 flex flex-col gap-6 order-1 xl:order-2 sticky top-6 self-start">
        <div class="relative w-full aspect-[1.586/1] perspective-1000 group">
          <div class="w-full h-full relative transition-all duration-700 preserve-3d"
            :class="{ 'rotate-y-180': isFlipped }">
            <!-- FRONT FACE -->
            <div
              class="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-[#080808]">
              <!-- Texture & Noise -->
              <div class="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black opacity-60"></div>
              <div
                class="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 blur-[80px] rounded-full mix-blend-overlay">
              </div>

              <div class="relative z-10 p-6 flex flex-col justify-between h-full">
                <div class="flex justify-between items-start">
                  <div class="text-xs font-bold tracking-[0.2em] text-white/40 font-mono uppercase">{{ displayBrand }}
                  </div>
                  <UIcon name="i-heroicons-wifi" class="size-8 rotate-90 text-white/20" />
                </div>

                <div class="space-y-6">
                  <div class="flex items-center gap-4">
                    <!-- Chip -->
                    <div
                      class="w-12 h-9 rounded-md bg-linear-to-tr from-[#d4af37]/20 to-[#f9d976]/20 border border-[#d4af37]/40 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                      <div class="absolute inset-0 bg-linear-to-b from-white/10 to-transparent"></div>
                      <div class="w-full h-px bg-[#d4af37]/30 absolute top-1/3"></div>
                      <div class="w-full h-px bg-[#d4af37]/30 absolute bottom-1/3"></div>
                      <div class="h-full w-px bg-[#d4af37]/30 absolute left-1/3"></div>
                      <div class="h-full w-px bg-[#d4af37]/30 absolute right-1/3"></div>
                    </div>
                    <UIcon name="i-heroicons-signal" class="size-5 text-white/20 rotate-90" />
                  </div>

                  <div class="font-mono text-2xl tracking-[0.14em] text-white/90 drop-shadow-lg truncate">
                    {{ state.number || '0000 0000 0000 0000' }}
                  </div>
                </div>

                <div class="flex justify-between items-end text-neutral-400">
                  <div class="max-w-[70%]">
                    <div class="text-[8px] uppercase tracking-widest mb-1 opacity-40 font-bold">Titular</div>
                    <div class="font-medium uppercase tracking-widest text-xs text-neutral-200 truncate">{{
                      state.holder || 'NOMBRE APELLIDO' }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-[8px] uppercase tracking-widest mb-1 opacity-40 font-bold">Expira</div>
                    <div class="font-mono text-xs text-neutral-200 tracking-wider">{{ state.expiry || 'MM/AA' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- BACK FACE -->
            <div
              class="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-[#080808]">
              <!-- Texture -->
              <div class="absolute inset-0 bg-linear-to-bl from-white/10 via-transparent to-black opacity-60"></div>

              <div class="relative z-10 flex flex-col h-full py-6">
                <!-- Magnetic Strip -->
                <div class="w-full h-12 bg-black/80 mb-6 relative overflow-hidden">
                  <div class="absolute inset-0 bg-noise opacity-20"></div>
                </div>

                <!-- Signature & CVC -->
                <div class="px-6 space-y-2">
                  <div class="flex gap-4 items-center">
                    <div class="flex-1 h-10 bg-white/10 rounded-sm flex items-center px-4 overflow-hidden relative">
                      <div
                        class="absolute inset-0 bg-repeating-linear-to-r from-transparent via-white/5 to-transparent bg-size-[4px_4px]">
                      </div>
                      <span
                        class="font-handwriting text-black/40 text-lg transform -rotate-1 translate-y-0.5 select-none"
                        style="font-family: 'Brush Script MT', cursive; filter: invert(1);">{{ state.holder }}</span>
                    </div>
                    <div
                      class="w-16 h-10 bg-white rounded-sm flex items-center justify-center text-black font-mono font-bold tracking-widest text-lg shadow-inner">
                      {{ state.cvv || '123' }}
                    </div>
                  </div>
                  <span class="text-[8px] text-white/30 uppercase tracking-widest block text-right pr-1">Código de
                    seguridad</span>
                </div>

                <div class="mt-auto px-6 flex justify-between items-center opacity-30">
                  <UIcon name="i-heroicons-globe-alt" class="size-8" />
                  <span class="text-[8px] tracking-widest uppercase">Alcatraz Secure Vault</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 text-center">
          <p class="text-xs text-gray-500">
            Vista previa interactiva. El código CVV se encuentra al reverso.
          </p>
        </div>
      </div>
    </div>
  </FormLayout>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
</style>
