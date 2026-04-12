<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const { profile, updateProfile, user } = useUser()

const currentLocale = computed(() => locales.value.find(l => l.code === locale.value))

const availableLocales = computed(() => locales.value.filter(l => l.code !== locale.value))

const toggleLanguage = async () => {
  const nextLocale = locale.value === 'es' ? 'en' : 'es'
  
  // Update global locale instantly
  await setLocale(nextLocale)
  
  // If user is logged in, sync with profile in the background
  if (user.value && profile.value) {
    try {
      await updateProfile({
        language: nextLocale
      })
    } catch (e) {
      console.error('Failed to sync language preference:', e)
    }
  }
}
</script>

<template>
  <UButton
    variant="ghost"
    color="neutral"
    size="sm"
    class="font-mono text-[10px] tracking-widest uppercase hover:text-emerald-400 transition-colors px-2 py-1 min-h-0"
    @click="toggleLanguage"
  >
    <template #leading>
      <UIcon name="i-heroicons-language" class="size-3.5" />
    </template>
    {{ locale }}
  </UButton>
</template>
