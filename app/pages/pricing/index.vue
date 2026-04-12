<script lang="ts" setup>
import type { PricingPlanProps } from '@nuxt/ui'

const { t } = useI18n()

useHead(() => ({
  title: t('pricing.title') + ' · Alcatraz',
  meta: [
    { name: 'description', content: t('pricing.desc') }
  ]
}))

const commonUi = {
  root: 'relative grid rounded-2xl p-8 gap-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-transform duration-300 hover:scale-[1.02]',
  title: 'text-white text-2xl font-bold tracking-tight',
  description: 'text-neutral-400 text-sm leading-relaxed mt-2',
  price: 'text-white text-4xl font-bold tracking-tight',
  billingCycle: 'text-neutral-500 text-sm font-medium',
  featureIcon: 'size-5 shrink-0 text-green-400',
  featureTitle: 'text-neutral-300 text-sm',
}

const plans = computed(() => {
  const p: PricingPlanProps[] = [
    {
      title: t('pricing.plans.free.name'),
      description: t('pricing.plans.free.desc'),
      price: t('pricing.plans.free.price'),
      billingCycle: `/ ${t('pricing.monthly').toLowerCase()}`,
      features: [
        { title: t('landing.security.featured.list[0]') ?? '' },
        { title: t('landing.stats.notes') ?? '' },
        { title: t('landing.stats.architecture') ?? '' },
        { title: t('landing.features.manager.title') ?? '' },
        { title: (t('landing.features.manager.desc') ?? '').split('.')[0] || '' },
      ],
      button: {
        label: t('pricing.plans.free.button'),
        to: '/login',
        color: 'neutral',
        variant: 'outline',
        size: 'lg',
        block: true,
        class: 'hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400 transition-colors'
      },
      ui: commonUi
    },
    {
      title: t('pricing.plans.premium.name'),
      description: t('pricing.plans.premium.desc'),
      price: t('pricing.plans.premium.price'),
      billingCycle: `/ ${t('pricing.monthly').toLowerCase()}`,
      badge: { label: t('profile.security.title'), color: 'neutral', variant: 'subtle', class: 'bg-green-500/10 text-green-400 border border-green-500/20' },
      highlight: true,
      scale: true,
      features: [
        { title: t('landing.cta.benefits[0]') ?? '' },
        { title: `2FA + ${t('auth.2fa.backup') ?? ''}` },
        { title: t('profile.devices.history') ?? '' },
        { title: `${t('landing.features.manager.title') ?? ''} ${t('landing.stats.notesCount') ?? ''}` },
        { title: t('landing.features.audit.title') ?? '' },
      ],
      button: { label: t('pricing.plans.premium.button'), to: '/login', size: 'lg', block: true, class: 'btn-accent' },
      class: 'ring-2 ring-white/20 relative z-10',
      ui: {
        ...commonUi,
        root: 'relative grid rounded-2xl p-8 gap-6 bg-green-500/5 backdrop-blur-xl border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.1)] transition-transform duration-300 hover:scale-[1.02]',
      }
    },
    {
      title: t('pricing.plans.family.name'),
      description: t('pricing.plans.family.desc'),
      price: t('pricing.plans.family.price'),
      billingCycle: `/ ${t('pricing.monthly').toLowerCase()}`,
      features: [
        { title: `${t('pricing.plans.premium.name') ?? ''} x 6` },
        { title: 'SSO (SAML/OIDC)' },
        { title: 'SCIM / Provisioning' },
        { title: t('landing.features.audit.title') ?? '' },
        { title: t('footer.contact') ?? '' },
        { title: 'SLA 99.9%' },
      ],
      button: { label: t('landing.cta.sales'), to: '/contacto', color: 'neutral', variant: 'soft', size: 'lg', block: true, class: 'hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400 transition-colors' },
      ui: commonUi
    }
  ]
  return p
})
</script>

<template>
  <div class="relative min-h-screen bg-black text-white overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-green-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-0 right-0 w-150 h-150 bg-green-900/20 rounded-full blur-[100px]"></div>
    </div>

    <UContainer class="relative z-10 py-16 sm:py-24">
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          {{ $t('pricing.title') }}
        </h1>
        <p class="text-lg sm:text-xl text-neutral-400">
          {{ $t('pricing.desc') }}
        </p>
      </div>

      <UPricingPlans :plans="plans" />
    </UContainer>
  </div>
</template>
