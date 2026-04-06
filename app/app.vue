<script setup lang="ts">
const colorMode = useColorMode();
// Force dark mode
colorMode.preference = "dark";

// -----------------------------------------------
</script>

<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
