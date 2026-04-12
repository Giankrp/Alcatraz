<script lang="ts" setup>
const { t } = useI18n()
useHead(() => ({
  title: t('landing.hero.title') + ' ' + t('landing.hero.titleAccent') + ' · Alcatraz',
  meta: [
    { name: 'description', content: t('landing.hero.desc') },
    { property: 'og:title', content: 'Alcatraz — ' + t('landing.hero.badge') },
    { property: 'og:description', content: t('landing.hero.desc') }
  ]
}))
</script>

<template>
  <div>
    <!-- Hero -->
    <UContainer class="pt-20 pb-28 hero-glow relative">
      <div class="relative z-10">
        <div class="flex justify-center animate-fade-up">
          <UBadge color="neutral" variant="soft" size="md"
            class="px-4 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
            <UIcon name="i-heroicons-shield-check" class="size-3.5 mr-1" />
            {{ $t('landing.hero.badge') }}
          </UBadge>
        </div>

        <h1
          class="mt-10 text-center text-5xl md:text-7xl font-extrabold tracking-tight animate-fade-up animate-delay-100">
          {{ $t('landing.hero.title') }}
          <span class="block bg-linear-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
            {{ $t('landing.hero.titleAccent') }}
          </span>
        </h1>

        <p class="mt-8 mx-auto max-w-2xl text-center text-neutral-400 text-lg animate-fade-up animate-delay-200">
          {{ $t('landing.hero.desc') }}
        </p>

        <div class="mt-10 flex items-center justify-center gap-4 animate-fade-up animate-delay-300">
          <UButton to="/login" class="btn-accent btn-lg hover:scale-[1.02] transition-transform">
            {{ $t('landing.hero.ctaStart') }}
            <UIcon name="i-heroicons-arrow-right-16-solid" class="size-4" />
          </UButton>
          <UButton to="/demo" variant="outline" color="neutral"
            class="btn btn-lg btn-ghost hover:scale-[1.02] transition-transform hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400">
            {{ $t('landing.hero.ctaDemo') }}
          </UButton>
        </div>

        <!-- Stat cards -->
        <div class="mt-16 grid gap-5 sm:grid-cols-3 animate-fade-up animate-delay-400">
          <div class="stat-card flex items-center gap-4">
            <div class="icon-accent">
              <UIcon name="i-heroicons-lock-closed" class="size-5" />
            </div>
            <div>
              <div class="text-2xl font-bold tracking-tight">256-bit</div>
              <div class="text-sm text-neutral-400">{{ $t('landing.stats.encryption') }}</div>
            </div>
          </div>

          <div class="stat-card flex items-center gap-4">
            <div class="icon-accent">
              <UIcon name="i-heroicons-document-text" class="size-5" />
            </div>
            <div>
              <div class="text-2xl font-bold tracking-tight">{{ $t('landing.stats.notesCount') }}</div>
              <div class="text-sm text-neutral-400">{{ $t('landing.stats.notes') }}</div>
            </div>
          </div>

          <div class="stat-card flex items-center gap-4">
            <div class="icon-accent">
              <UIcon name="i-heroicons-shield-check" class="size-5" />
            </div>
            <div>
              <div class="text-2xl font-bold tracking-tight">{{ $t('landing.stats.architectureDesc') }}</div>
              <div class="text-sm text-neutral-400">{{ $t('landing.stats.architecture') }}</div>
            </div>
          </div>
        </div>

        <!-- Hero Dashboard Mockup -->
        <div class="mt-20 animate-fade-up animate-delay-500">
          <div class="hero-mockup-wrapper">
            <div class="hero-mockup-glow" />
            <div class="hero-mockup-frame">
              <!-- Browser chrome -->
              <div class="browser-bar">
                <div class="flex items-center gap-1.5">
                  <span class="size-2.5 rounded-full bg-white/10" />
                  <span class="size-2.5 rounded-full bg-white/10" />
                  <span class="size-2.5 rounded-full bg-white/10" />
                </div>
                <div class="browser-url">
                  <UIcon name="i-heroicons-lock-closed" class="size-2.5 text-green-400" />
                  <span>alcatraz.app/boveda</span>
                </div>
                <div />
              </div>
              <!-- Screenshot -->
              <NuxtImg src="/images/hero-dashboard.png" alt="Alcatraz — Panel de la bóveda"
                class="w-full block rounded-b-xl" loading="eager" />
            </div>
          </div>
        </div>
      </div>
    </UContainer>

    <div class="section-divider" />

    <!-- Características completas -->
    <section class="bg-(--surface-1)">
      <UContainer id="caracteristicas" class="py-24">
        <h2 class="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold animate-fade-up">
          {{ $t('landing.features.title') }}
        </h2>
        <p class="mt-4 text-center text-neutral-400 px-4 animate-fade-up animate-delay-100">
          {{ $t('landing.features.desc') }}
        </p>

        <div class="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          <SecurityCard :title="$t('landing.features.manager.title')"
            :description="$t('landing.features.manager.desc')"
            icon="i-heroicons-key" class="animate-fade-up animate-delay-100" />
          <SecurityCard :title="$t('landing.features.notes.title')"
            :description="$t('landing.features.notes.desc')"
            icon="i-heroicons-document-text" class="animate-fade-up animate-delay-200" />
          <SecurityCard :title="$t('landing.features.multiplatform.title')"
            :description="$t('landing.features.multiplatform.desc')"
            icon="i-heroicons-device-phone-mobile" class="animate-fade-up animate-delay-300" />
          <SecurityCard :title="$t('landing.features.backup.title')"
            :description="$t('landing.features.backup.desc')"
            icon="i-heroicons-cloud" class="animate-fade-up animate-delay-400" />
          <SecurityCard :title="$t('landing.features.biometric.title')"
            :description="$t('landing.features.biometric.desc')"
            icon="i-heroicons-finger-print" class="animate-fade-up animate-delay-500" />
          <SecurityCard :title="$t('landing.features.audit.title')"
            :description="$t('landing.features.audit.desc')"
            icon="i-heroicons-shield-check" class="animate-fade-up animate-delay-600" />
        </div>
      </UContainer>
    </section>

    <div class="section-divider" />

    <!-- Seguridad en cada paso -->
    <UContainer id="seguridad" class="py-24">
      <h2 class="text-center text-4xl md:text-5xl font-extrabold animate-fade-up">{{ $t('landing.security.title') }}</h2>
      <p class="mt-4 text-center text-neutral-400 animate-fade-up animate-delay-100">
        {{ $t('landing.security.desc') }}
      </p>

      <div class="mt-12 grid gap-5 md:grid-cols-2">
        <!-- Large featured card -->
        <div class="landing-card-accent md:p-8 p-6 animate-fade-up animate-delay-200">
          <div class="flex items-center gap-3 mb-5">
            <div class="icon-accent">
              <UIcon name="i-heroicons-lock-closed" class="size-5" />
            </div>
            <div class="text-xl md:text-2xl font-bold">Cifrado de extremo a extremo</div>
          </div>

          <p class="text-neutral-400">
            Utilizamos cifrado AES-256, el mismo estándar usado por bancos y gobiernos.
            Tus datos se cifran en tu dispositivo antes de enviarse a la nube.
          </p>


          <ul class="mt-6 space-y-3">
            <li v-for="(item, idx) in $tm('landing.security.featured.list')" :key="idx" class="flex items-center gap-3 text-neutral-300">
              <UIcon name="i-heroicons-check-circle" class="size-5 text-green-400 shrink-0" />
              {{ $rt(item) }}
            </li>
          </ul>
        </div>

        <!-- Stacked cards column -->
        <div class="grid gap-5">
          <div class="landing-card p-6 animate-fade-up animate-delay-300">
            <div class="flex items-center gap-3 mb-3">
              <div class="icon-accent">
                <UIcon name="i-heroicons-eye-slash" class="size-5" />
              </div>
              <div class="text-base sm:text-lg font-semibold">{{ $t('landing.security.cards.zeroKnowledge.title') }}</div>
            </div>
            <p class="text-neutral-400">
              {{ $t('landing.security.cards.zeroKnowledge.desc') }}
            </p>
          </div>

          <div class="landing-card p-6 animate-fade-up animate-delay-400">
            <div class="flex items-center gap-3 mb-3">
              <div class="icon-accent">
                <UIcon name="i-heroicons-server-stack" class="size-5" />
              </div>
              <div class="text-base sm:text-lg font-semibold">{{ $t('landing.security.cards.infrastructure.title') }}</div>
            </div>
            <p class="text-neutral-400">
              {{ $t('landing.security.cards.infrastructure.desc') }}
            </p>
          </div>

          <div class="landing-card p-6 animate-fade-up animate-delay-500">
            <div class="flex items-center gap-3 mb-3">
              <div class="icon-accent">
                <UIcon name="i-heroicons-code-bracket" class="size-5" />
              </div>
              <div class="text-base sm:text-lg font-semibold">{{ $t('landing.security.cards.openSource.title') }}</div>
            </div>
            <p class="text-neutral-400">
              {{ $t('landing.security.cards.openSource.desc') }}
            </p>
          </div>
        </div>
      </div>
    </UContainer>

    <div class="section-divider" />

    <!-- CTA final -->
    <section class="cta-section">
      <UContainer class="py-28 text-center relative z-10">
        <h2 class="text-4xl md:text-5xl font-extrabold animate-fade-up">
          {{ $t('landing.cta.title') }}
        </h2>
        <p class="mt-4 text-neutral-400 text-lg animate-fade-up animate-delay-100">
          {{ $t('landing.cta.desc') }}
        </p>

        <div class="mt-10 flex justify-center gap-4 animate-fade-up animate-delay-200">
          <UButton to="/login" class="btn-accent btn-lg hover:scale-[1.02] transition-transform">
            <UIcon name="i-heroicons-arrow-right-16-solid" class="size-4" />
            {{ $t('landing.cta.start') }}
          </UButton>
          <UButton to="/contacto" color="neutral" variant="outline"
            class="btn btn-lg btn-ghost hover:scale-[1.02] transition-transform hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400">
            {{ $t('landing.cta.sales') }}
          </UButton>
        </div>

        <div
          class="mt-8 flex flex-wrap justify-center gap-6 text-base text-neutral-400 animate-fade-up animate-delay-300">
          <span v-for="(benefit, idx) in $tm('landing.cta.benefits')" :key="idx" class="inline-flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="size-4 text-green-400" />
            {{ $rt(benefit) }}
          </span>
        </div>
      </UContainer>
    </section>
  </div>
</template>
