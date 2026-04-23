<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()

useHead(() => ({
  title: t('legal.contact.title') + ' · Alcatraz'
}))

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const pending = ref(false)

const handleSubmit = async () => {
  pending.value = true
  // Simular envío
  await new Promise(resolve => setTimeout(resolve, 1500))

  toast.add({
    title: 'Mensaje enviado',
    description: 'Gracias por contactar con nosotros. Te responderemos pronto.',
    color: 'success'
  })

  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  pending.value = false
}
</script>

<template>
  <div class="relative min-h-screen bg-black text-white pt-24 pb-16">
    <!-- Background Gradient -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-green-500/10 blur-[120px] pointer-events-none"></div>

    <UContainer class="max-w-2xl relative z-10">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold mb-4">{{ $t('legal.contact.title') }}</h1>
        <p class="text-zinc-400">{{ $t('legal.contact.desc') }}</p>
      </div>

      <UCard class="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
        <form @submit.prevent="handleSubmit" class="space-y-6 p-2">
          <UFormField :label="$t('legal.contact.form.name')">
            <UInput v-model="form.name" required class="w-full" size="lg" />
          </UFormField>

          <UFormField :label="$t('legal.contact.form.email')">
            <UInput v-model="form.email" type="email" required class="w-full" size="lg" />
          </UFormField>

          <UFormField :label="$t('legal.contact.form.subject')">
            <UInput v-model="form.subject" required class="w-full" size="lg" />
          </UFormField>

          <UFormField :label="$t('legal.contact.form.message')">
            <UTextarea v-model="form.message" :rows="5" required class="w-full" size="lg" />
          </UFormField>

          <UButton type="submit" block size="xl" color="neutral" :loading="pending">
            {{ $t('legal.contact.form.submit') }}
          </UButton>
        </form>
      </UCard>

      <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 flex items-start gap-4">
          <UIcon name="i-heroicons-envelope" class="size-6 text-green-500 mt-1" />
          <div>
            <h3 class="font-bold text-white mb-1">Email</h3>
            <p class="text-zinc-400 text-sm">soporte@alcatraz.io</p>
          </div>
        </div>
        <div class="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 flex items-start gap-4">
          <UIcon name="i-heroicons-chat-bubble-left-right" class="size-6 text-green-500 mt-1" />
          <div>
            <h3 class="font-bold text-white mb-1">Comunidad</h3>
            <p class="text-zinc-400 text-sm">Discord oficial</p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
