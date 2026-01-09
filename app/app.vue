<script setup lang="ts">
const colorMode = useColorMode()
// Force dark mode
colorMode.preference = 'dark'

// --- DEV ONLY: Auto-unlock vault for testing ---
const { setMasterPassword } = useMasterPassword()
onMounted(() => {
  console.log(' DEV MODE: Vault auto-unlocked with key "123456"')
  setMasterPassword('123456')
})
// -----------------------------------------------
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
