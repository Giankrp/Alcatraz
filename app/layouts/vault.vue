<script setup lang="ts">
// Inicia el escudo de inactividad de la bóveda
// 5 minutos sin actividad bloquearán automáticamente la app
useAutoLock(5)
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <slot />
  </div>
</template>
