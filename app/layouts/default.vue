<script setup lang="ts">
const route = useRoute()
const showHeader = computed(() => !route.path.startsWith('/boveda'))
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col">
    <header v-if="showHeader" class="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/20">
      <UContainer class="h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="size-8 rounded-full grid place-items-center bg-black text-white">
            <UIcon name="i-heroicons-lock-closed" class="size-5" />
          </div>
          <span class="font-semibold">
            <ULink to="/">Alcatraz</ULink>
          </span>
        </div>

        <nav class="hidden md:flex items-center gap-8 text-sm">
          <ULink to="/#caracteristicas">Características</ULink>
          <ULink to="/#seguridad">Seguridad</ULink>
        </nav>

        <div class="flex items-center gap-3">
          <ULink to="/login">Iniciar Sesión</ULink>
          <UButton to="/login" color="neutral" variant="solid" size="sm">
            Comenzar Gratis
          </UButton>
        </div>
      </UContainer>
    </header>

    <main class="flex-1 min-h-0">
      <slot />
    </main>

    <Footer v-if="showHeader" />
  </div>
</template>
