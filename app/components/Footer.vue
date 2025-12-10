<script setup lang="ts">
// ... existing code ...
</script>

<template>
  <footer class="border-t bg-white text-black">
    <UContainer class="py-14 grid gap-12 md:grid-cols-4 ">
      <!-- Brand -->
      <div>
        <div class="flex items-center gap-3">
          <div class="size-8 rounded-full bg-black grid place-items-center text-white">
            <UIcon name="i-heroicons-lock-closed" class="size-5" />
          </div>
          <span class="font-semibold">Alcatraz</span>
        </div>
        <p class="mt-4 text-sm opacity-70">
          Seguridad impenetrable para tus contraseñas y notas cifradas.
        </p>
      </div>

      <!-- Producto -->
      <div>
        <div class="font-semibold">Producto</div>
        <ul class="mt-3 space-y-2 text-sm opacity-90">
          <li><ULink to="#caracteristicas">Características</ULink></li>
          <li><ULink to="#seguridad">Seguridad</ULink></li>
          <li><ULink to="#precios">Precios</ULink></li>
          <li><ULink to="/descargas">Descargas</ULink></li>
        </ul>
      </div>

      <!-- Empresa -->
      <div>
        <div class="font-semibold">Empresa</div>
        <ul class="mt-3 space-y-2 text-sm opacity-90">
          <li><ULink to="/sobre-nosotros">Sobre Nosotros</ULink></li>
          <li><ULink to="/blog">Blog</ULink></li>
          <li><ULink to="/careras">Carreras</ULink></li>
          <li><ULink to="/contacto">Contacto</ULink></li>
        </ul>
      </div>

      <!-- Legal -->
      <div>
        <div class="font-semibold">Legal</div>
        <ul class="mt-3 space-y-2 text-sm opacity-90">
          <li><ULink to="/privacidad">Privacidad</ULink></li>
          <li><ULink to="/terminos">Términos</ULink></li>
          <li><ULink to="/cookies">Cookies</ULink></li>
          <li><ULink to="/licencias">Licencias</ULink></li>
        </ul>
      </div>
    </UContainer>

    <div class="border-t">
      <UContainer class="py-6 text-center text-sm opacity-70">
        © 2025 Alcatraz. Todos los derechos reservados.
      </UContainer>
    </div>
  </footer>
</template>
