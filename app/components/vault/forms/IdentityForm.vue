<script setup lang="ts">
import { z } from 'zod'
import FormLayout from './FormLayout.vue'

const emit = defineEmits(['back', 'save'])

const props = defineProps<{
  initialData?: any
  loading?: boolean
}>()

const schema = z.object({
  title: z.string().min(1, 'El nombre es requerido'),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().or(z.literal('')),
  phone: z.string(),
  address: z.string(),
  licenseNumber: z.string().optional(),
  passportNumber: z.string().optional(),
  folder: z.string()
})

const state = reactive({
  title: props.initialData?.title || '',
  firstName: props.initialData?.firstName || '',
  lastName: props.initialData?.lastName || '',
  email: props.initialData?.email || '',
  phone: props.initialData?.phone || '',
  address: props.initialData?.address || '',
  licenseNumber: props.initialData?.licenseNumber || '',
  passportNumber: props.initialData?.passportNumber || '',
  folder: props.initialData?.folder || 'personal'
})

const folders = [
  { label: 'Personal', value: 'personal' },
  { label: 'Trabajo', value: 'work' }
]

function handleSaveLayout() {
  emit('save', { ...state })
}
</script>

<template>
  <FormLayout 
    :title="initialData ? 'Editar Identidad' : 'Nueva Identidad'" 
    :can-save="true" 
    :is-editing="!!initialData"
    :loading="loading"
    @back="emit('back')" 
    @save="handleSaveLayout"
  >
    <UForm :schema="schema" :state="state" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="Nombre de la identidad" name="title">
          <UInput 
            v-model="state.title" 
            placeholder="Ej. Pasaporte Personal" 
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
        <UFormGroup label="Nombre" name="firstName">
          <UInput 
            v-model="state.firstName" 
            placeholder="Juan" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>
        <UFormGroup label="Apellidos" name="lastName">
          <UInput 
            v-model="state.lastName" 
            placeholder="Pérez" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="Email" name="email">
          <UInput 
            v-model="state.email" 
            placeholder="juan@example.com" 
            icon="i-heroicons-envelope" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>
        <UFormGroup label="Teléfono" name="phone">
          <UInput 
            v-model="state.phone" 
            placeholder="+1 234 567 890" 
            icon="i-heroicons-phone" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="Licencia de conducir" name="licenseNumber">
          <UInput 
            v-model="state.licenseNumber" 
            placeholder="A-12345678" 
            icon="i-heroicons-identification" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>
        <UFormGroup label="Pasaporte" name="passportNumber">
          <UInput 
            v-model="state.passportNumber" 
            placeholder="P-87654321" 
            icon="i-heroicons-globe-alt" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>
      </div>

      <UFormGroup label="Dirección" name="address">
        <UTextarea 
          v-model="state.address" 
          :rows="3" 
          placeholder="Calle Falsa 123..." 
          variant="none" 
          class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors bottom-3" 
          autocomplete="off" 
          autoresize
        />
      </UFormGroup>

      <div class="rounded-xl bg-white/5 p-4 border border-white/5 flex gap-4 items-start">
        <div class="p-2 bg-white/5 rounded-lg">
          <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 class="text-sm font-medium text-white mb-1">Identidad protegida</h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            Tus datos personales están encriptados y seguros. Nunca compartimos tu información con terceros.
          </p>
        </div>
      </div>
    </UForm>
  </FormLayout>
</template>
