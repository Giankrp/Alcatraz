<script setup lang="ts">
const route = useRoute()
const showHeader = computed(() => !route.path.startsWith('/boveda'))
const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col">
    <header v-if="showHeader" class="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/20">
      <UContainer class="h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UButton
            icon="i-heroicons-bars-3"
            
            variant="ghost"
            class="md:hidden"
            @click="isMobileMenuOpen = true"
            :ui="{base : 'bg-white'}"
      
          />
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
          <ULink to="/login" class="hidden sm:block">Iniciar Sesión</ULink>
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

    <USlideover v-model="isMobileMenuOpen" side="left">
      <div class="flex flex-col h-full bg-black text-white border-r border-white/10">
        <div class="p-4 flex items-center justify-between border-b border-white/10">
          <div class="flex items-center gap-2">
             <UIcon name="i-heroicons-lock-closed" class="size-5" />
             <span class="font-bold text-lg">Alcatraz</span>
          </div>
          <UButton icon="i-heroicons-x-mark" variant="ghost" @click="isMobileMenuOpen = false"
           :ui="{base : 'bg-white'}"
          />
        </div>
        <nav class="flex flex-col gap-2 p-4">
          <ULink to="/#caracteristicas" class="p-2 hover:bg-white/10 rounded-md" @click="isMobileMenuOpen = false">Características</ULink>
          <ULink to="/#seguridad" class="p-2 hover:bg-white/10 rounded-md" @click="isMobileMenuOpen = false">Seguridad</ULink>
          <div class="h-px bg-white/10 my-2"></div>
          <ULink to="/login" class="p-2 hover:bg-white/10 rounded-md" @click="isMobileMenuOpen = false">Iniciar Sesión</ULink>
        </nav>
      </div>
    </USlideover>
  </div>
</template>
