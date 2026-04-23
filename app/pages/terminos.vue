<script setup lang="ts">
const { t } = useI18n()

useHead(() => ({
  title: t('legal.terms.title') + ' · Alcatraz',
  meta: [
    { name: 'description', content: t('landing.hero.desc') }
  ]
}))
</script>

<template>
  <div class="relative min-h-screen bg-black text-white pt-24 pb-16">
    <UContainer class="max-w-3xl">
      <div class="mb-12">
        <h1 class="text-4xl font-extrabold mb-4">{{ $t('legal.terms.title') }}</h1>
        <p class="text-zinc-500 text-sm">{{ $t('legal.terms.lastUpdated') }}</p>
      </div>

      <div class="prose prose-invert max-w-none space-y-12">
        <section v-for="(section, idx) in $tm('legal.terms.sections')" :key="idx" class="space-y-4">
          <h2 class="text-2xl font-bold text-white border-b border-zinc-800 pb-2">
            {{ $rt(section.title) }}
          </h2>
          <p class="text-zinc-400 leading-relaxed">
            {{ $rt(section.content) }}
          </p>
        </section>
      </div>

      <div class="mt-16 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
        <p class="text-zinc-400 mb-6">{{ $t('legal.contact.desc') }}</p>
        <UButton to="/contacto" color="neutral" variant="solid" size="lg">
          {{ $t('legal.contact.title') }}
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
