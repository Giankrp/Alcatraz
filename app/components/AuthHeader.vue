<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  icon?: string
  align?: 'left' | 'center'
  inverted?: boolean
}

const props = defineProps<Props>()
const alignClass = props.align === 'left' ? 'items-start text-left' : 'items-center text-center'
const bubbleClass = props.inverted ? 'bg-white text-black' : 'bg-black text-white'
</script>

<template>
  <header :class="['flex flex-col gap-2', alignClass]" aria-label="Encabezado de autenticación" role="banner">
    <div class="flex items-center gap-3" :class="alignClass">
      <div class="size-10 rounded-xl grid place-items-center shadow-sm border border-black/10" :class="bubbleClass">
        <UIcon :name="icon || 'i-heroicons-lock-closed'" class="size-5" aria-hidden="true" />
      </div>
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">{{ title }}</h2>
    </div>
    <p v-if="subtitle" class="text-sm sm:text-base opacity-70 leading-relaxed">
      {{ subtitle }}
    </p>
    <slot />
  </header>
</template>

<style scoped>
</style>

<!--
Uso:

<AuthHeader
  title="Inicia sesión"
  subtitle="Bienvenido de vuelta. Protegemos tus datos con máxima seguridad."
  icon="i-heroicons-lock-closed"
  align="center"
/>

Props:
- title (string, requerido): título principal del encabezado.
- subtitle (string, opcional): subtítulo descriptivo.
- icon (string, opcional): nombre del ícono (UIcon) a mostrar.
- align ("left" | "center", opcional): alineación del contenido.

Accesibilidad:
- Usa un <header> con aria-label y tipografía con buen contraste.
-->