<script setup lang="ts">
import { z } from 'zod'
import FormLayout from './FormLayout.vue'

const emit = defineEmits(['back', 'save'])

const schema = z.object({
  title: z.string().min(1, 'El nombre es requerido'),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email('Email inválido').or(z.literal('')),
  phone: z.string(),
  address: z.string(),
  folder: z.string()
})

const state = reactive({
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  folder: 'personal'
})

const folders = [
  { label: 'Personal', value: 'personal' },
  { label: 'Trabajo', value: 'work' }
]

function handleSaveLayout(layoutData: { createAnother: boolean }) {
  emit('save', { ...state, ...layoutData })
}
</script>

<template>
  <FormLayout title="Nueva Identidad" :can-save="true" @back="emit('back')" @save="handleSaveLayout">
    <UForm :schema="schema" :state="state" class="space-y-4">
      <UFormGroup label="Nombre de la identidad" name="title">
        <UInput v-model="state.title" placeholder="Ej. Pasaporte Personal" icon="i-heroicons-tag" variant="outline" class="bg-white/5" autocomplete="off" />
      </UFormGroup>

      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="Nombre" name="firstName">
          <UInput v-model="state.firstName" placeholder="Juan" variant="outline" class="bg-white/5" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="Apellidos" name="lastName">
          <UInput v-model="state.lastName" placeholder="Pérez" variant="outline" class="bg-white/5" autocomplete="off" />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" placeholder="juan@example.com" icon="i-heroicons-envelope" variant="outline" class="bg-white/5" autocomplete="off" />
        </UFormGroup>
        <UFormGroup label="Teléfono" name="phone">
          <UInput v-model="state.phone" placeholder="+1 234 567 890" icon="i-heroicons-phone" variant="outline" class="bg-white/5" autocomplete="off" />
        </UFormGroup>
      </div>

      <UFormGroup label="Dirección" name="address">
        <UTextarea v-model="state.address" :rows="3" placeholder="Calle Falsa 123..." variant="outline" class="bg-white/5" autocomplete="off" />
      </UFormGroup>
    </UForm>
  </FormLayout>
</template>
