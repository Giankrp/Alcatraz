<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  icon?: string
}>()

</script>

<template>
  <div class="landing-card p-6 group">
    <div class="flex items-center gap-3 mb-4">
      <div class="icon-accent group-hover:scale-110 transition-transform duration-300">
        <UIcon :name="icon || 'i-heroicons-information-circle'" class="size-5" />
      </div>
      <div class="text-base sm:text-lg font-semibold">{{ title }}</div>
    </div>
    <p class="text-neutral-400 text-sm leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>