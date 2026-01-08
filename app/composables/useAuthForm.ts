import { ref } from 'vue'
import { navigateTo } from '#app'
import { z } from 'zod'
import type { AuthFormField, ButtonProps, FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().email('Introduce un email válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  remember: z.boolean().optional()
})

type Schema = z.infer<typeof schema>

export function useAuthForm() {
  const fields = ref<AuthFormField[]>([
    { name: 'email', type: 'email', label: 'Email', placeholder: 'tu@correo.com', required: true, icon: 'i-heroicons-envelope' },
    { name: 'password', type: 'password', label: 'Contraseña', placeholder: '••••••••', required: true, icon: 'i-heroicons-lock-closed' },
    { name: 'remember', type: 'checkbox', label: 'Recordar credenciales' }
  ])

  const providers = ref<ButtonProps[]>([
    { label: 'Google', icon: 'i-logos-google-icon', color: 'neutral', variant: 'solid', class: 'provider-glass text-white' },
    { label: 'GitHub', icon: 'i-logos-github-icon', color: 'neutral', variant: 'solid', class: 'provider-glass text-white' },
    { label: 'Apple', icon: 'i-material-icon-theme:applescript', color: 'neutral', variant: 'solid', class: 'provider-glass text-white' }
  ])

  const submitted = ref(false)

  function onSubmit(event: FormSubmitEvent<Schema>) {
    submitted.value = false
    setTimeout(() => {
      submitted.value = true
      navigateTo('/boveda')
    }, 800)
  }

  function resetFeedback() {
    submitted.value = false
  }

  return { schema, fields, providers, submitted, onSubmit, resetFeedback }
}
