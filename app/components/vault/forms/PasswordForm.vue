<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import FormLayout from './FormLayout.vue'

const emit = defineEmits(['back', 'save'])

const schema = z.object({
  title: z.string().min(1, 'El nombre es requerido'),
  username: z.string().email('Debe ser un email válido').or(z.string()),
  password: z.string(),
  url: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  folder: z.string()
})

type Schema = z.output<typeof schema>

const state = reactive({
  title: '',
  username: '',
  password: '',
  url: '',
  folder: 'personal'
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

function handleSaveLayout(layoutData: { createAnother: boolean }) {
  emit('save', { ...state, ...layoutData })
}
</script>

<template>
  <FormLayout title="Nueva Contraseña" :can-save="true" @back="emit('back')" @save="handleSaveLayout">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Nombre del elemento" name="title">
        <UInput v-model="state.title" placeholder="Ej. Google, Netflix" icon="i-heroicons-tag" variant="outline" class="bg-white/5" autocomplete="off" />
      </UFormGroup>

      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="Usuario / Correo" name="username">
          <UInput v-model="state.username" placeholder="user@example.com" icon="i-heroicons-user" variant="outline" class="bg-white/5" autocomplete="off" />
        </UFormGroup>

        <UFormGroup label="Carpeta" name="folder">
          <USelect v-model="state.folder" :items="folders" variant="outline" class="bg-white/5" />
        </UFormGroup>
      </div>

      <UFormGroup label="Contraseña" name="password">
        <UButtonGroup size="md" orientation="horizontal" class="w-full">
          <UInput 
            v-model="state.password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="••••••••" 
            icon="i-heroicons-key" 
            variant="outline"
            class="flex-1 bg-white/5" 
            autocomplete="off"
          />
          <UButton :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" color="neutral" variant="soft" @click="showPassword = !showPassword" />
          <UButton icon="i-heroicons-arrow-path" color="neutral" variant="soft" @click="generatePassword" />
        </UButtonGroup>
      </UFormGroup>

      <UFormGroup label="URL (Opcional)" name="url">
        <UInput v-model="state.url" placeholder="https://..." icon="i-heroicons-link" variant="outline" class="bg-white/5" autocomplete="off" />
      </UFormGroup>
    </UForm>
  </FormLayout>
</template>
