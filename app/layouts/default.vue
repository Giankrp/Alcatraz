<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
      <UContainer class="h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="size-8 rounded-full grid place-items-center bg-black text-white">
            <UIcon name="i-heroicons-lock-closed" class="size-5" />
          </div>
          <span class="font-semibold">Alcatraz</span>
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

    <main>
      <slot />
    </main>

    <Footer />
  </div>
</template>
