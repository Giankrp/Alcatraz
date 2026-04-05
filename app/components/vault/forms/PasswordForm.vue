<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import FormLayout from './FormLayout.vue'



const emit = defineEmits(['back', 'save'])

const props = defineProps<{
  initialData?: any
  loading?: boolean
}>()

const schema = z.object({
  title: z.string().min(1, 'El nombre es requerido'),
  username: z.email('Debe ser un email válido').or(z.string()),
  password: z.string(),
  url: z.url('Debe ser una URL válida').optional().or(z.literal('')),
  folder: z.string()
})

type Schema = z.output<typeof schema>

const { folders: rawFolders } = useVault()
const folderOptions = computed(() => rawFolders.value.map(f => ({
  label: f.name,
  value: f.id
})))

const defaultFolderId = computed(() => rawFolders.value.find(f => f.is_default)?.id || 'personal')

const state = reactive({
  title: props.initialData?.title || '',
  username: props.initialData?.username || '',
  password: props.initialData?.password || '',
  url: props.initialData?.url || '',
  folder: props.initialData?.folder || defaultFolderId.value
})

const showPassword = ref(false)
const isPopoverOpen = ref(false)

const {
  password: generatedPassword,
  length,
  includeUppercase,
  includeNumbers,
  includeSymbols,
  generatePassword: doGenerate
} = usePasswordGenerator()

watch([length, includeUppercase, includeNumbers, includeSymbols], () => {
  doGenerate()
})

function applyGeneratedPassword() {
  state.password = generatedPassword.value
  isPopoverOpen.value = false
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('save', event.data)
}

function handleSaveLayout() {
  emit('save', { ...state })
}
</script>

<template>
  <FormLayout :title="initialData ? 'Editar Contraseña' : 'Nueva Contraseña'" :can-save="true"
    :is-editing="!!initialData" :loading="loading" @back="emit('back')" @save="handleSaveLayout">
    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="Nombre del elemento" name="title">
          <UInput v-model="state.title" placeholder="Ej. Google, Netflix" icon="i-heroicons-tag" variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            autocomplete="off" />
        </UFormGroup>

        <UFormGroup label="Categoría" name="folder">
          <USelect v-model="state.folder" :items="folderOptions" variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            icon="i-heroicons-folder" />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="Usuario / Correo" name="username">
          <UInput v-model="state.username" placeholder="user@example.com" icon="i-heroicons-user" variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            autocomplete="off" />
        </UFormGroup>

        <UFormGroup label="Contraseña" name="password">
          <div class="flex items-center gap-2 w-full">
            <UInput v-model="state.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
              icon="i-heroicons-key" variant="none"
              class="flex-1 bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
              autocomplete="off" />
            <UButton :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" color="neutral" variant="ghost" 
              class="bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-colors"
              @click="showPassword = !showPassword" type="button" />
            <UPopover v-model:open="isPopoverOpen" :ui="{ content: 'bg-transparent dark:bg-transparent shadow-none ring-0' }">
              <UButton icon="i-heroicons-sparkles" color="neutral" variant="ghost" 
                class="bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-colors text-green-400" 
                type="button" />
              <template #content>
                <div
                  class="p-5 w-80 space-y-5 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl ring-1 ring-white/5">
                  <div class="flex items-center justify-between border-b border-white/10 pb-4">
                    <span class="font-mono text-green-400 break-all text-sm font-semibold select-all">{{
                      generatedPassword }}</span>
                    <UButton icon="i-heroicons-arrow-path" color="neutral" variant="ghost" size="sm" type="button"
                      @click="doGenerate()" class="shrink-0 ml-3 hover:bg-white/5 opacity-70 hover:opacity-100" />
                  </div>

                  <div class="space-y-5 pt-1">
                    <div class="space-y-3">
                      <div
                        class="flex justify-between items-center text-[10px] text-neutral-400 uppercase tracking-[0.15em] font-bold">
                        <span>Longitud</span>
                        <span class="text-white text-xs">{{ length }}</span>
                      </div>
                      <input type="range" v-model.number="length" min="8" max="64"
                        class="w-full accent-green-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <div class="space-y-3">
                      <div class="flex justify-between items-center">
                        <span class="text-xs text-neutral-300 font-medium">Mayúsculas (A-Z)</span>
                        <USwitch v-model="includeUppercase" />
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-xs text-neutral-300 font-medium">Números (0-9)</span>
                        <USwitch v-model="includeNumbers" />
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-xs text-neutral-300 font-medium">Símbolos (!@#)</span>
                        <USwitch v-model="includeSymbols" />
                      </div>
                    </div>
                  </div>

                  <UButton block class="btn-accent border border-green-500/30 font-semibold mt-2" size="md" type="button"
                    @click="applyGeneratedPassword">
                    Usar contraseña
                  </UButton>
                </div>
              </template>
            </UPopover>
          </div>
        </UFormGroup>
      </div>

      <UFormGroup label="URL (Opcional)" name="url">
        <UInput v-model="state.url" placeholder="https://..." icon="i-heroicons-link" variant="none"
          class="bg-white/5 rounded-lg border border-white/5 bottom-3 focus-within:border-white/20 transition-colors"
          autocomplete="off" />
      </UFormGroup>

      <div class="rounded-xl bg-white/5 p-4 border border-white/5 flex gap-4 items-start pt-6">
        <div class="p-2 bg-white/5 rounded-lg">
          <UIcon name="i-heroicons-lock-closed" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 class="text-sm font-medium text-white mb-1">Contraseña encriptada</h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            Tus credenciales se cifran localmente con AES-256 antes de enviarse al servidor. Nunca almacenamos tu
            contraseña
            en texto plano.
          </p>
        </div>
      </div>
    </UForm>
  </FormLayout>
</template>
