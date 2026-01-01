<script setup lang="ts">
const emit = defineEmits(['select'])

const types = [
  { id: 'password', label: 'Contraseña', icon: 'i-heroicons-key', color: 'text-primary-400', desc: 'Guardar credenciales de inicio de sesión' },
  { id: 'note', label: 'Nota Segura', icon: 'i-heroicons-document-text', color: 'text-yellow-400', desc: 'Información sensible cifrada' },
  { id: 'card', label: 'Tarjeta de Pago', icon: 'i-heroicons-credit-card', color: 'text-blue-400', desc: 'Tarjetas de crédito o débito' },
  { id: 'identity', label: 'Identidad', icon: 'i-heroicons-user-circle', color: 'text-green-400', desc: 'Pasaportes, licencias, etc.' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="text-center mb-6">
      <h3 class="text-xl font-bold text-white mb-2">¿Qué deseas guardar?</h3>
      <p class="text-gray-400 text-sm">Selecciona el tipo de elemento que quieres añadir a tu bóveda.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        v-for="t in types"
        :key="t.id"
        class="group relative flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200 border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 hover:-translate-y-0.5"
        @click="emit('select', t.id)"
      >
        <div class="p-2.5 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
          <UIcon :name="t.icon" class="size-6" :class="t.color" />
        </div>
        <div>
          <div class="font-semibold text-white text-sm group-hover:text-primary-200 transition-colors">{{ t.label }}</div>
          <div class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ t.desc }}</div>
        </div>
      </button>
    </div>
  </div>
</template>
