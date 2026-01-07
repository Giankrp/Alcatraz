<script setup lang="ts">
defineProps<{
  title: string
  canSave?: boolean
  loading?: boolean
  isEditing?: boolean
}>()

const emit = defineEmits(['back', 'save'])

// Expose the state to the parent if needed, or emit it with save
const handleSave = () => {
  emit('save')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3 pb-4 border-b border-white/10">
      <UButton 
        icon="i-heroicons-arrow-left" 
        color="neutral" 
        variant="ghost" 
        size="sm" 
        @click="emit('back')" 
        tabindex="0"
        class="hover:bg-white/10"
      />
      <h3 class="text-xl font-bold text-white">{{ title }}</h3>
    </div>

    <!-- Content Slot -->
    <div class="space-y-6">
      <slot />
    </div>

    <!-- Footer -->
    <div class="pt-6 border-t border-white/10 mt-6">
      <div class="flex gap-4">
        <UButton 
          block 
          color="neutral" 
          variant="ghost" 
          class="flex-1 hover:bg-white/10" 
          @click="emit('back')"
          :disabled="loading"
        >
          Cancelar
        </UButton>
        <UButton 
          block 
          color="neutral" 
          variant="solid" 
          class="flex-1 shadow-lg shadow-white/10" 
          :loading="loading"
          :disabled="!canSave"
          @click="handleSave"
        >
          {{ isEditing ? 'Actualizar información' : 'Crear' }}
        </UButton>
      </div>
    </div>
  </div>
</template>
