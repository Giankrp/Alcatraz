<script lang="ts" setup>
import type { PricingPlanProps } from '@nuxt/ui'

const commonUi = {
  root: 'relative grid rounded-2xl p-8 gap-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-transform duration-300 hover:scale-[1.02]',
  title: 'text-white text-2xl font-bold tracking-tight',
  description: 'text-neutral-400 text-sm leading-relaxed mt-2',
  price: 'text-white text-4xl font-bold tracking-tight',
  billingCycle: 'text-neutral-500 text-sm font-medium',
  featureIcon: 'size-5 shrink-0 text-white',
  featureTitle: 'text-neutral-300 text-sm',
}

const plans: PricingPlanProps[] = [
  {
    title: 'Solo',
    description: 'Lo esencial para proteger contraseñas y notas en todos tus dispositivos.',
    price: '€10',
    billingCycle: '/mes',
    features: [
      'Cifrado AES-256',
      'Notas cifradas ilimitadas',
      'Arquitectura zero-knowledge',
      'Generador de contraseñas',
      'Autocompletado en sitios',
    ],
    button: { label: 'Empezar', to: '/login', color: 'neutral', variant: 'outline', size: 'lg', block: true },
    ui: commonUi
  },
  {
    title: 'Pro',
    description: 'Para usuarios avanzados que quieren más control, auditoría y seguridad extra.',
    price: '€20',
    billingCycle: '/mes',
    badge: { label: 'Mejor valor', color: 'neutral', variant: 'solid' },
    highlight: true,
    scale: true,
    features: [
      'Todo lo de Solo',
      '2FA y códigos de respaldo',
      'Historial de cambios',
      'Carpetas y etiquetas avanzadas',
      'Compartir ítems de forma segura',
    ],
    button: { label: 'Elegir Pro', to: '/login', color: 'neutral', variant: 'solid', size: 'lg', block: true },
    class: 'ring-2 ring-white/20 relative z-10',
    ui: {
      ...commonUi,
      root: 'relative grid rounded-2xl p-8 gap-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-transform duration-300 hover:scale-[1.02]',
    }
  },
  {
    title: 'Empresarial',
    description: 'Seguridad y control empresarial: cumplimiento, gestión y soporte de alto nivel.',
    price: '€59',
    billingCycle: '/usuario/mes',
    features: [
      'Todo lo de Pro',
      'SSO (SAML/OIDC)',
      'SCIM / aprovisionamiento',
      'Registros de auditoría y alertas',
      'Políticas y controles de acceso',
      'SLA, soporte 24/7 y gestor dedicado',
    ],
    button: { label: 'Hablar con ventas', to: '/contacto', color: 'neutral', variant: 'soft', size: 'lg', block: true },
    ui: commonUi
  }
]
</script>


<template>
  <div class="relative min-h-screen bg-black text-white overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-neutral-900/30 rounded-full blur-3xl opacity-50"></div>
      <div class="absolute bottom-0 right-0 w-150 h-150 bg-neutral-900/20 rounded-full blur-3xl opacity-30"></div>
    </div>  

    <UContainer class="relative z-10 py-16 sm:py-24">
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          Planes simples y transparentes
        </h1>
        <p class="text-lg sm:text-xl text-neutral-400">
          Elige el plan que mejor se adapte a tus necesidades de seguridad. Sin costes ocultos.
        </p>
      </div>
      
      <UPricingPlans :plans="plans" />
    </UContainer>
  </div>
</template>
