<script setup lang="ts">
import { z } from 'zod'
import FormLayout from './FormLayout.vue'

const emit = defineEmits(['back', 'save'])

const schema = z.object({
  title: z.string().min(1, 'El nombre es requerido'),
  holder: z.string(),
  number: z.string(),
  expiry: z.string(),
  cvv: z.string(),
  folder: z.string()
})

const state = reactive({
  title: '',
  holder: '',
  number: '',
  expiry: '',
  cvv: '',
  folder: 'personal'
})

const folders = [
  { label: 'Personal', value: 'personal' },
  { label: 'Trabajo', value: 'work' },
  { label: 'Finanzas', value: 'finance' }
]

function handleSaveLayout(layoutData: { createAnother: boolean }) {
  emit('save', { ...state, ...layoutData })
}
</script>

<template>
  <FormLayout title="Nueva Tarjeta" :can-save="true" @back="emit('back')" @save="handleSaveLayout">
    <UForm :schema="schema" :state="state" class="space-y-4">
      <UFormGroup label="Nombre descriptivo" name="title">
        <UInput v-model="state.title" placeholder="Ej. Visa Oro" icon="i-heroicons-tag" variant="outline" class="bg-white/5" autocomplete="off" />
      </UFormGroup>

      <UFormGroup label="Titular de la tarjeta" name="holder">
        <UInput v-model="state.holder" placeholder="NOMBRE APELLIDO" icon="i-heroicons-user" variant="outline" class="bg-white/5" autocomplete="off" />
      </UFormGroup>

      <UFormGroup label="Número de tarjeta" name="number">
        <UInput v-model="state.number" placeholder="0000 0000 0000 0000" icon="i-heroicons-credit-card" variant="outline" class="bg-white/5" autocomplete="off" />
      </UFormGroup>

      <div class="grid grid-cols-3 gap-4">
        <UFormGroup label="Expiración" name="expiry" class="col-span-1">
          <UInput v-model="state.expiry" placeholder="MM/AA" variant="outline" class="bg-white/5" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="CVV" name="cvv" class="col-span-1">
          <UInput v-model="state.cvv" placeholder="123" type="password" variant="outline" class="bg-white/5" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="Carpeta" name="folder" class="col-span-1">
          <USelect v-model="state.folder" :options="folders" variant="outline" class="bg-white/5" />
        </UFormGroup>
      </div>
    </UForm>
  </FormLayout>
</template>
