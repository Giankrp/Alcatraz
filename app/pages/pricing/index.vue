<script lang="ts" setup>
import type { PricingPlanProps } from '@nuxt/ui'

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
    button: { label: 'Empezar', to: '/login', color: 'neutral', variant: 'outline', class: 'btn btn-lg' },
    ui: {
      root: 'relative grid rounded-xl p-6 lg:p-8 xl:p-10 gap-6 bg-black text-white border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.35)]',
      title: 'text-white text-2xl sm:text-3xl text-pretty font-semibold',
      description: 'text-white/70 text-base text-pretty mt-2',
      price: 'text-white text-3xl sm:text-4xl font-semibold',
      discount: 'text-white/50 line-through text-xl sm:text-2xl',
      billingPeriod: 'text-white/60 truncate text-xs font-medium',
      billingCycle: 'text-white/60 truncate text-xs font-medium',
      featureIcon: 'size-5 shrink-0 text-white/70',
      featureTitle: 'text-white/70 text-sm truncate',
      terms: 'text-xs/5 text-white/60 text-center text-balance'
    }
  },
  {
    title: 'Pro',
    description: 'Para usuarios avanzados que quieren más control, auditoría y seguridad extra.',
    price: '€20',
    billingCycle: '/mes',
    badge: { label: 'Mejor valor', color: 'neutral', variant: 'soft' },
    scale: true,
    features: [
      'Todo lo de Solo',
      '2FA y códigos de respaldo',
      'Historial de cambios',
      'Carpetas y etiquetas avanzadas',
      'Compartir ítems de forma segura',
    ],
    button: { label: 'Elegir Pro', to: '/login', color: 'neutral', variant: 'solid', class: 'btn btn-lg' },
    class: 'ring-1 ring-white/25',
    ui: {
      root: 'relative grid rounded-xl p-6 lg:p-8 xl:p-10 gap-6 bg-black text-white border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.55)]',
      title: 'text-white text-2xl sm:text-3xl text-pretty font-semibold',
      description: 'text-white/70 text-base text-pretty mt-2',
      price: 'text-white text-3xl sm:text-4xl font-semibold',
      discount: 'text-white/50 line-through text-xl sm:text-2xl',
      billingPeriod: 'text-white/60 truncate text-xs font-medium',
      billingCycle: 'text-white/60 truncate text-xs font-medium',
      featureIcon: 'size-5 shrink-0 text-white/70',
      featureTitle: 'text-white/70 text-sm truncate',
      terms: 'text-xs/5 text-white/60 text-center text-balance'
    }
  },
  {
    title: 'Empresarial',
    description: 'Seguridad y control empresarial: cumplimiento, gestión y soporte de alto nivel.',
    price: '€59',
    billingCycle: '/usuario/mes',
    badge: { label: 'Exclusivo', color: 'neutral', variant: 'soft' },
    features: [
      'Todo lo de Pro',
      'SSO (SAML/OIDC)',
      'SCIM / aprovisionamiento',
      'Registros de auditoría y alertas',
      'Políticas y controles de acceso',
      'SLA, soporte 24/7 y gestor dedicado',
    ],
    button: { label: 'Hablar con ventas', to: '/contacto', color: 'neutral', variant: 'solid', class: 'btn btn-lg' },
    class: 'border-white/20',
    ui: {
      root: 'relative grid rounded-xl p-6 lg:p-8 xl:p-10 gap-6 bg-black text-white border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.35)]',
      title: 'text-white text-2xl sm:text-3xl text-pretty font-semibold',
      description: 'text-white/70 text-base text-pretty mt-2',
      price: 'text-white text-3xl sm:text-4xl font-semibold',
      discount: 'text-white/50 line-through text-xl sm:text-2xl',
      billingPeriod: 'text-white/60 truncate text-xs font-medium',
      billingCycle: 'text-white/60 truncate text-xs font-medium',
      featureIcon: 'size-5 shrink-0 text-white/70',
      featureTitle: 'text-white/70 text-sm truncate',
      terms: 'text-xs/5 text-white/60 text-center text-balance'
    }
  }
]
</script>


<template>
  <div class="min-h-screen bg-black text-white">
    <UContainer class="py-16 sm:py-20">
      <div class="max-w-2xl">
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">Precios</h1>
        <p class="mt-4 text-base sm:text-lg opacity-75">
          Planes diseñados para el look general de Alcatraz (oscuro, limpio y consistente).
        </p>
      </div>

      <UPricingPlans :plans="plans" class="mt-10" />
    </UContainer>
  </div>
</template>
