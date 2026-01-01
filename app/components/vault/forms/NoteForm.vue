<script setup lang="ts">
import { z } from 'zod'
import FormLayout from './FormLayout.vue'

const emit = defineEmits(['back', 'save'])

const schema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  folder: z.string(),
  note: z.string().optional()
})

const state = reactive({
  title: '',
  note: '',
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
  <FormLayout title="Nueva Nota Segura" :can-save="true" @back="emit('back')" @save="handleSaveLayout">
    <UForm :schema="schema" :state="state" class="space-y-4">
      <UFormGroup label="Título" name="title">
        <UInput v-model="state.title" placeholder="Ej. Códigos de respaldo" icon="i-heroicons-tag" variant="outline" class="bg-white/5" autocomplete="off" />
      </UFormGroup>

      <UFormGroup label="Carpeta" name="folder">
        <USelect v-model="state.folder" :items="folders" variant="outline" class="bg-white/5" />  
      </UFormGroup>

      <UFormGroup label="Contenido" name="note">
        <UTextarea v-model="state.note" :rows="6" placeholder="Escribe tu nota segura aquí..." variant="outline" class="bg-white/5" autocomplete="off" />
      </UFormGroup>
    </UForm>
  </FormLayout>
</template>
