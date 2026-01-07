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
  number: z.string(),
  expiry: z.string(),
  cvv: z.string(),
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

function handleSaveLayout() {
  emit('save', { ...state })
}
</script>

<template>
  <FormLayout 
    :title="initialData ? 'Editar Tarjeta' : 'Nueva Tarjeta'" 
    :can-save="true" 
    :is-editing="!!initialData"
    @back="emit('back')" 
    @save="handleSaveLayout"
  >
    <UForm :schema="schema" :state="state" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormGroup label="Nombre descriptivo" name="title">
          <UInput 
            v-model="state.title" 
            placeholder="Ej. Visa Oro" 
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
        <UFormGroup label="Titular de la tarjeta" name="holder">
          <UInput 
            v-model="state.holder" 
            placeholder="NOMBRE APELLIDO" 
            icon="i-heroicons-user" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>

        <UFormGroup label="Número de tarjeta" name="number">
          <UInput 
            v-model="state.number" 
            placeholder="0000 0000 0000 0000" 
            icon="i-heroicons-credit-card" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <UFormGroup label="Expiración" name="expiry">
          <UInput 
            v-model="state.expiry" 
            placeholder="MM/AA" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>
        <UFormGroup label="CVV" name="cvv">
          <UInput 
            v-model="state.cvv" 
            placeholder="123" 
            type="password" 
            variant="none" 
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors" 
            autocomplete="off" 
          />
        </UFormGroup>
      </div>

      <div class="rounded-xl bg-white/5 p-4 border border-white/5 flex gap-4 items-start">
        <div class="p-2 bg-white/5 rounded-lg">
          <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 class="text-sm font-medium text-white mb-1">Datos financieros protegidos</h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            La información de tu tarjeta nunca se comparte y se almacena con el máximo nivel de seguridad (PCI DSS Compliant).
          </p>
        </div>
      </div>
    </UForm>
  </FormLayout>
</template>
