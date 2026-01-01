<script setup lang="ts">
defineProps<{
  title: string
  canSave?: boolean
}>()

const emit = defineEmits(['back', 'save'])
const createAnother = ref(false)

// Expose the state to the parent if needed, or emit it with save
const handleSave = () => {
  emit('save', { createAnother: createAnother.value })
}
</script>

<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <UButton 
        icon="i-heroicons-arrow-left" 
        color="neutral" 
        variant="ghost" 
        size="sm" 
        @click="emit('back')" 
        tabindex="0"
      />
      <h3 class="text-lg font-bold text-white">{{ title }}</h3>
    </div>

    <!-- Content Slot -->
    <div class="space-y-4">
      <slot />
    </div>

    <!-- Footer -->
    <div class="pt-6 space-y-4">
      <div class="flex items-center justify-between px-1">
        <UCheckbox 
          v-model="createAnother" 
          name="createAnother" 
          label="Crear otro elemento" 
          color="primary"
          :ui="{ label: 'text-sm text-gray-400' }"
        />
      </div>
      
      <div class="flex gap-3">
        <UButton 
          block 
          color="neutral" 
          variant="ghost" 
          class="flex-1" 
          @click="emit('back')"
        >
          Cancelar
        </UButton>
        <UButton 
          block 
          color="primary" 
          variant="solid" 
          class="flex-1" 
          :loading="!canSave"
          @click="handleSave"
        >
          Guardar
        </UButton>
      </div>
    </div>
  </div>
</template>
