<script setup lang="ts">
import { useRegisterForm } from "~/composables/useRegisterForm"

const { t, schema, fields, providers, submitted, error, generatedRecoveryKey, showRecoveryKey, completeRegistration, onSubmit, resetFeedback } = useRegisterForm()
const hasSavedKey = ref(false)

useHead(() => ({
  title: t('register.title') + ' · Alcatraz',
  meta: [
    { name: 'description', content: t('register.meta.desc') },
    { property: 'og:title', content: t('register.title') + ' — Alcatraz' },
    { property: 'og:description', content: t('register.meta.desc') }
  ]
}))
</script>

<template>
  <div class="relative min-h-screen login-bg text-white overflow-hidden grid place-items-center py-16">
    <div class="absolute inset-0 z-0 overflow-hidden">
      <span class="bubble bubble-1"></span>
      <span class="bubble bubble-2"></span>
      <span class="bubble bubble-3"></span>
      <span class="bubble bubble-4"></span>
      <span class="bubble bubble-5"></span>
      <span class="bubble bubble-6"></span>
    </div>

    <UContainer>

      <div class="mx-auto max-w-md relative z-10">
        <UCard class="glass-card-dark transition-all duration-300 hover:shadow-2xl"
          :ui="{ body: 'p-6 sm:p-8', header: 'p-0' }">
          
          <template v-if="showRecoveryKey">
            <div class="space-y-6 text-center animate-fade-in">
              <div class="mx-auto size-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <UIcon name="i-heroicons-shield-check" class="size-8 text-emerald-500" />
              </div>
              <h2 class="text-2xl font-bold uppercase tracking-widest text-emerald-500">¡Registro Completado!</h2>
              <p class="text-sm text-zinc-400 leading-relaxed">
                Esta es tu <strong class="text-emerald-500">Clave de Recuperación</strong>. <br>
                Es la <strong>única forma</strong> de recuperar tu cuenta si olvidas tu Contraseña Maestra. Guárdala en un lugar seguro y secreto.
              </p>
              
              <div class="p-5 bg-black border border-emerald-500/30 rounded-lg relative">
                <code class="text-emerald-400 font-mono text-sm tracking-widest break-all select-all">{{ generatedRecoveryKey }}</code>
              </div>
              
              <UCheckbox 
                v-model="hasSavedKey" 
                label="He guardado esta clave en un lugar seguro" 
                class="mt-6 text-left" 
                :ui="{ label: 'text-zinc-300 text-xs uppercase tracking-wider' }"
              />
              
              <UButton 
                block 
                class="mt-8 bg-emerald-500 hover:bg-emerald-400 text-black h-12 rounded-lg font-bold tracking-widest uppercase text-xs"
                :disabled="!hasSavedKey"
                @click="completeRegistration"
              >
                Ir al Inicio de Sesión
              </UButton>
            </div>
          </template>

          <template v-else>
            <UAlert v-if="submitted" color="success" variant="soft" :title="$t('register.alerts.success')"
              :description="$t('register.alerts.successDesc')" class="mb-4" @close="resetFeedback" />
            <UAlert v-if="error" color="error" variant="soft" title="Error de registro"
              description="Ha ocurrido un error al intentar registrar la cuenta. Revisa los datos o intenta con otro correo." class="mb-4" @close="resetFeedback" />

            <UAuthForm :title="$t('register.title')" :description="$t('register.desc')"
              icon="i-heroicons-user-plus" :schema="schema" :fields="fields" :providers="providers"
              :separator="{ label: $t('register.form.separator') }"
              :submit="{ label: $t('register.form.submit'), icon: 'i-heroicons-arrow-right-16-solid', color: 'neutral', variant: 'solid', class: 'btn btn-lg' }"
              class="w-full space-y-6 auth-dark" @submit="onSubmit" @error="resetFeedback">

              <template #footer>
                <p class="text-center text-sm text-zinc-400">
                  {{ $t('register.form.hasAccount') }}
                  <ULink to="/login" class="font-medium text-emerald-500 hover:text-emerald-400">{{ $t('register.form.login') }}</ULink>
                </p>
              </template>
            </UAuthForm>
          </template>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.glass-card-dark {
  position: relative;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(24px) saturate(120%);
  -webkit-backdrop-filter: blur(24px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.glass-card-dark {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.glass-card-dark::before {
  content: "";
  position: absolute;
  inset: -30% -10% auto -10%;
  height: 200px;
  background: radial-gradient(120px 60px at 20% 50%, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0));
  filter: blur(24px);
  transform: translate3d(0, 0, 0);
  animation: glassShift 12s ease-in-out infinite;
}

.glass-card-dark::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.bubble {
  position: absolute;
  border-radius: 9999px;
  filter: blur(12px);
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.2));
  mix-blend-mode: screen;
  opacity: 0.85;
  animation: float 14s ease-in-out infinite;
}

.login-bg {
  isolation: isolate;
  background:
    radial-gradient(1000px 500px at 10% 10%, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0)),
    radial-gradient(800px 400px at 80% 20%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0)),
    linear-gradient(180deg, #0b0b0d, #121217 60%, #0b0b0d);
}

.bubble-1 {
  width: 220px;
  height: 220px;
  top: 6%;
  left: 8%;
  animation-duration: 12s;
}

.bubble-2 {
  width: 160px;
  height: 160px;
  top: 18%;
  right: 8%;
  animation-duration: 10s;
  animation-delay: 0.6s;
}

.bubble-3 {
  width: 280px;
  height: 280px;
  bottom: 6%;
  left: 4%;
  animation-duration: 14s;
  animation-delay: 1.2s;
}

.bubble-4 {
  width: 180px;
  height: 180px;
  bottom: 12%;
  right: 10%;
  animation-duration: 11s;
  animation-delay: 1.8s;
}

.bubble-5 {
  width: 120px;
  height: 120px;
  top: 48%;
  left: 44%;
  animation-duration: 9s;
  animation-delay: 0.3s;
}

.bubble-6 {
  width: 200px;
  height: 200px;
  top: 68%;
  right: 38%;
  animation-duration: 13s;
  animation-delay: 1.1s;
}

@keyframes float {

  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.75;
  }

  20% {
    transform: translate3d(24px, -28px, 0) scale(1.03);
    opacity: 0.85;
  }

  50% {
    transform: translate3d(-20px, 18px, 0) scale(1.07);
    opacity: 0.7;
  }

  80% {
    transform: translate3d(16px, -12px, 0) scale(1.02);
    opacity: 0.8;
  }
}

@keyframes glassShift {

  0%,
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 0.9;
  }

  50% {
    transform: translate3d(20px, -10px, 0);
    opacity: 0.75;
  }
}

.auth-dark :deep(input[type="email"]),
.auth-dark :deep(input[type="password"]),
.auth-dark :deep(input[type="text"]),
.auth-dark :deep(input[type="search"]),
.auth-dark :deep(textarea),
.auth-dark :deep(select) {
  background: #000;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.auth-dark :deep(input[type="checkbox"]) {
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  margin: 0;
  vertical-align: middle;
}

.auth-dark :deep(label) {
  cursor: pointer;
}

.auth-dark :deep(input::placeholder),
.auth-dark :deep(textarea::placeholder) {
  color: rgba(255, 255, 255, 0.55);
}

.auth-dark :deep(input:focus),
.auth-dark :deep(textarea:focus),
.auth-dark :deep(select:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.18);
}

:global(.provider-glass) {
  position: relative;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px) saturate(110%);
  -webkit-backdrop-filter: blur(12px) saturate(110%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  transition: background-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

:global(.provider-glass:hover) {
  background: rgba(0, 0, 0, 0.6);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

:global(.provider-glass:focus-visible) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.18), 0 10px 24px rgba(0, 0, 0, 0.35);
}

:global(.provider-glass::before) {
  content: "";
  position: absolute;
  inset: -50% -20% auto -20%;
  height: 120px;
  background: radial-gradient(100px 50px at 20% 50%, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0));
  filter: blur(14px);
  opacity: 0.75;
  pointer-events: none;
  transition: opacity .2s ease;
}

:global(.provider-glass:hover::before) {
  opacity: 0.95;
}
</style>