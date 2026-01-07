<script setup lang="ts">
import { z } from 'zod'
import FormLayout from './FormLayout.vue'
import type { SelectItem } from '@nuxt/ui';



const emit = defineEmits(['back', 'save'])

const props = defineProps<{
  initialData?: any
  loading?: boolean
}>()

const schema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  folder: z.string(),
  note: z.string().optional()
})

const state = reactive({
  title: props.initialData?.title || '',
  note: props.initialData?.note || '',
  folder: props.initialData?.folder || 'personal'
})

const folders = [
  { label: 'Personal', value: 'personal' },
  { label: 'Trabajo', value: 'work' },
  { label: 'Finanzas', value: 'finance' }
]

const items = ref<SelectItem[]>(folders)

function handleSaveLayout() {
  emit('save', { ...state })
}
</script>

<template>
  <FormLayout :title="initialData ? 'Editar Nota Segura' : 'Nueva Nota Segura'" :can-save="true"
    :is-editing="!!initialData" :loading="loading" @back="emit('back')" @save="handleSaveLayout">
    <UForm :schema="schema" :state="state" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="Título" name="title">
          <UInput v-model="state.title" placeholder="Ej. Códigos de respaldo" icon="i-heroicons-document-text"
            variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            autocomplete="off" />
        </UFormGroup>

        <UFormGroup label="Categoría" name="folder">
          <USelect v-model="state.folder" :items="items" variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            icon="i-heroicons-folder" :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200 ', base: 'bg-white/5'
            }" />
        </UFormGroup>
      </div>

      <UFormGroup label="Contenido" name="note">
        <div
          class="relative bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors group bottom-3">
          <UTextarea v-model="state.note" :rows="12" placeholder="Escribe tu nota segura aquí..." variant="none"
            class="w-full bg-transparent placeholder:text-gray-500 focus:ring-0 px-0 py-0 " :ui="{
              base: 'bg-transparent focus:ring-0 border-0 p-4 pb-10',
            }" autocomplete="off" autoresize />
          <div class="absolute bottom-3 right-4 pointer-events-none">
            <span
              class="text-xs text-gray-600 flex items-center gap-1.5 transition-colors group-focus-within:text-gray-500">
              <UIcon name="i-heroicons-lock-closed" class="w-3 h-3" />
              Encriptada de extremo a extremo
            </span>
          </div>
        </div>
      </UFormGroup>

      <div class="rounded-xl bg-white/5 p-4 border border-white/5 flex gap-4 items-start">
        <div class="p-2 bg-white/5 rounded-lg">
          <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 class="text-sm font-medium text-white mb-1">Nota completamente segura</h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            Tu nota será encriptada con cifrado AES-256 antes de ser guardada. Solo tú puedes acceder a su contenido.
          </p>
        </div>
      </div>
    </UForm>
  </FormLayout>
</template>
