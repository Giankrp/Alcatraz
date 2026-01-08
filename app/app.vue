<script setup lang="ts">
const colorMode = useColorMode()
// Force dark mode
colorMode.preference = 'dark'
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
