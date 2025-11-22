<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import type { AuthFormField, ButtonProps, FormSubmitEvent } from "@nuxt/ui"


const schema = z.object({
  email: z.string({ required_error: 'Introduce un email' }).email('Introduce un email válido'),
  password: z.string({ required_error: 'Ingresa tu contraseña' }).min(8, 'Mínimo 8 caracteres'),
  remember: z.boolean().optional()
})

type Schema = z.infer<typeof schema>

const fields = ref<AuthFormField[]>([
  { name: 'email', type: 'email', label: 'Email', placeholder: 'tu@correo.com', required: true, icon: 'i-heroicons-envelope' },
  { name: 'password', type: 'password', label: 'Contraseña', placeholder: '••••••••', required: true, icon: 'i-heroicons-lock-closed' },
  { name: 'remember', type: 'checkbox', label: 'Recordar credenciales' }
])

const providers = ref<ButtonProps[]>([
  { label: 'Google', icon: 'i-logos-google-icon', color: 'neutral', variant: 'soft' },
  { label: 'GitHub', icon: 'i-logos-github-icon', color: 'neutral', variant: 'soft' }
])

const submitted = ref(false)

function onSubmit(event: FormSubmitEvent<Schema>) {
  submitted.value = false
  setTimeout(() => {
    submitted.value = true
  }, 800)
}

function resetFeedback() {
  submitted.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white grid place-items-center py-12">
    <UContainer>
      <div class="mx-auto max-w-md">
        <UCard
          class="transition-all duration-200 hover:shadow-xl border border-white/10 bg-black text-white"
          :ui="{ body: 'p-6 sm:p-8', header: 'p-0' }"
        >
          <UAlert
            v-if="submitted"
            color="success"
            variant="soft"
            title="Acceso concedido"
            description="Has iniciado sesión correctamente."
            class="mb-4"
            @close="resetFeedback"
          />

          <UAuthForm
            title="Inicia sesión"
            description="Bienvenido de vuelta. Protegemos tus datos con máxima seguridad."
            icon="i-heroicons-lock-closed"
            :schema="schema"
            :fields="fields"
            :providers="providers"
            :separator="{ label: 'o continúa con' }"
            :submit="{ label: 'Acceder', icon: 'i-heroicons-arrow-right-16-solid', color: 'neutral', variant: 'solid', class: 'bg-white text-black border border-white hover:bg-white/90' }"
            class="w-full space-y-6"
            @submit="onSubmit"
            @error="resetFeedback"
          >
            <template #password-hint>
              <ULink to="/recuperar" class="text-sm">¿Olvidaste tu contraseña?</ULink>
            </template>
            <template #footer>
              <p class="text-center text-sm">
                ¿No tienes cuenta?
                <ULink to="/registro" class="font-medium">Regístrate</ULink>
              </p>
            </template>
          </UAuthForm>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

