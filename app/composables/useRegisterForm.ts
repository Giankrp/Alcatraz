import { navigateTo } from '#app'
import { z } from 'zod'
import type { AuthFormField, ButtonProps, FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.email('Introduce un email válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  password_confirmation: z.string().min(8, 'Mínimo 8 caracteres')
}).refine((data) => data.password === data.password_confirmation, {
  message: "Las contraseñas no coinciden",
  path: ["password_confirmation"]
})
type Schema = z.infer<typeof schema>

export function useRegisterForm() {
  const fields = ref<AuthFormField[]>([
    { name: 'email', type: 'email', label: 'Email', placeholder: 'tu@correo.com', required: true, icon: 'i-heroicons-envelope' },
    { name: 'password', type: 'password', label: 'Contraseña', placeholder: '••••••••', required: true, icon: 'i-heroicons-lock-closed' },
    { name: 'password_confirmation', type: 'password', label: 'Confirmar contraseña', placeholder: '••••••••', required: true, icon: 'i-heroicons-lock-closed' }
  ])

  const providers = ref<ButtonProps[]>([
    { label: 'Google', icon: 'i-logos-google-icon', color: 'neutral', variant: 'solid', class: 'provider-glass text-white' },
    { label: 'GitHub', icon: 'i-logos-github-icon', color: 'neutral', variant: 'solid', class: 'provider-glass text-white' },
    { label: 'Apple', icon: 'i-material-icon-theme:applescript', color: 'neutral', variant: 'solid', class: 'provider-glass text-white' }
  ])

  const submitted = ref(false)

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {

    const { email, password } = event.data
    const config = useRuntimeConfig()

    console.log('Registering with:', email, password)
    submitted.value = false
    try {
      await $fetch(`${config.public.apiBase}/api/auth/register`, {
        method: 'POST',
        body: { email, password }
      })
      console.log('Registering with:', email, password)

      submitted.value = true
      // Navigate instantly or maybe wait a bit to show the success alert
      navigateTo('/login')
    } catch (error) {
      console.error('Error registering:', error)
      submitted.value = false
    }
  }

  function resetFeedback() {
    submitted.value = false
  }

  return { schema, fields, providers, submitted, onSubmit, resetFeedback }
}
