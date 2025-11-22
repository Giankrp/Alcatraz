<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  icon?: string
}>()

</script>

<template>
  <UCard class=" bg-black text-white">
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon :name="icon || 'i-heroicons-information-circle'" class="size-5" />
        <div class="text-base sm:text-lg font-semibold">{{ title }}</div>
      </div>
    </template>
    <p class="opacity-70 text-sm">
      {{ description }}
    </p>

  </UCard>
</template>