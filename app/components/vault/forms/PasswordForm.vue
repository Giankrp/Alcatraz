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

const state = reactive({
  title: props.initialData?.title || '',
  username: props.initialData?.username || '',
  password: props.initialData?.password || '',
  url: props.initialData?.url || '',
  folder: props.initialData?.folder || 'personal'
})

const folders = [
  { label: 'Personal', value: 'personal' },
  { label: 'Trabajo', value: 'work' },
  { label: 'Finanzas', value: 'finance' }
]

const showPassword = ref(false)

function generatePassword() {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
  let retVal = ""
  for (let i = 0, n = charset.length; i < 16; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  state.password = retVal
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('save', event.data)
}

function handleSaveLayout() {
  emit('save', { ...state })
}
</script>

<template>
  <FormLayout 
    :title="initialData ? 'Editar Contraseña' : 'Nueva Contraseña'" 
    :can-save="true" 
    :is-editing="!!initialData"
    :loading="loading"
    @back="emit('back')" 
    @save="handleSaveLayout"
  >
    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="Nombre del elemento" name="title">
          <UInput 
            v-model="state.title" 
            placeholder="Ej. Google, Netflix" 
            icon="i-heroicons-tag" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>

        <UFormGroup label="Categoría" name="folder">
          <USelect 
            v-model="state.folder" 
            :options="folders" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            icon="i-heroicons-folder"
          />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="Usuario / Correo" name="username">
          <UInput 
            v-model="state.username" 
            placeholder="user@example.com" 
            icon="i-heroicons-user" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>

        <UFormGroup label="Contraseña" name="password">
          <UButtonGroup size="md" orientation="horizontal" class="w-full">
            <UInput 
              v-model="state.password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              icon="i-heroicons-key" 
              variant="none"
              class="flex-1 bg-white/5 rounded-l-lg border border-white/5 focus-within:border-white/20 transition-colors" 
              autocomplete="off"
             
            />
            <UButton :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" color="neutral" variant="soft" @click="showPassword = !showPassword" />
            <UButton icon="i-heroicons-arrow-path" color="neutral" variant="soft" @click="generatePassword" />
          </UButtonGroup>
        </UFormGroup>
      </div>

      <UFormGroup label="URL (Opcional)" name="url">
        <UInput 
          v-model="state.url" 
          placeholder="https://..." 
          icon="i-heroicons-link" 
          variant="none" 
          class="bg-white/5 rounded-lg border border-white/5 bottom-3 focus-within:border-white/20 transition-colors" 
          autocomplete="off" 
        />
      </UFormGroup>

      <div class="rounded-xl bg-white/5 p-4 border border-white/5 flex gap-4 items-start pt-6">
        <div class="p-2 bg-white/5 rounded-lg">
          <UIcon name="i-heroicons-lock-closed" class="w-6 h-6 text-white" />
        </div>
        <div >
          <h4 class="text-sm font-medium text-white mb-1">Contraseña encriptada</h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            Tus credenciales se cifran localmente con AES-256 antes de enviarse al servidor. Nunca almacenamos tu contraseña en texto plano.
          </p>
        </div>
      </div>
    </UForm>
  </FormLayout>
</template>
