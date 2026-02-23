import { ref } from 'vue'
import { navigateTo } from '#app'
import { z } from 'zod'
import type { AuthFormField, ButtonProps, FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.email('Introduce un email válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  remember: z.boolean().optional()
})

type Schema = z.infer<typeof schema>

export function useAuthForm() {
  const fields = ref<AuthFormField[]>([
    { name: 'email', type: 'email', label: 'Email', placeholder: 'tu@correo.com', required: true, icon: 'i-heroicons-envelope' },
    { name: 'password', type: 'password', label: 'Contraseña', placeholder: '••••••••', required: true, icon: 'i-heroicons-lock-closed' },
    { name: 'remember', type: 'checkbox', label: 'Recordar credenciales' },
  ])

  const { signIn } = useAuth()

  const providers = ref<ButtonProps[]>([
    {
      label: 'Google',
      icon: 'i-logos-google-icon',
      color: 'neutral',
      variant: 'solid',
      class: 'provider-glass text-white',
      onClick: () => { signIn('google', { callbackUrl: '/boveda' }) },
      ui: {
        base: 'hover:cursor-pointer'
      }
    },
    {
      label: "Apple",
      icon: "i-material-icon-theme:applescript",
      color: "neutral",
      variant: "solid",
      class: "provider-glass text-white",
      /*  onClick: () => { signIn('apple', { callbackUrl: '/boveda' }) },
        ui: {
          base: 'hover:cursor-pointer'
        }*/
    },
    {
      label: 'GitHub',
      icon: 'i-logos-github-icon',
      color: 'neutral',
      variant: 'solid',
      class: 'provider-glass text-white',
      onClick: () => { signIn('github', { callbackUrl: '/boveda' }) },
      ui: {
        base: 'hover:cursor-pointer'
      }
    },
  ])

  const { setMasterPassword } = useMasterPassword()
  const submitted = ref(false)

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    submitted.value = false
    try {
      const { email, password } = event.data
      const config = useRuntimeConfig()

      // Llamada real al backend
      const response = await $fetch<any>(`${config.public.apiBase}/api/auth/login`, {
        method: 'POST',
        body: { email, password }
      })

      // Extraer y guardar token
      if (response && response.token) {
        // Reducido a 12 horas por seguridad (60s * 60m * 12h = 43200)
        const tokenToken = useCookie('auth_token', { maxAge: 60 * 60 * 12, httpOnly: true })
        tokenToken.value = response.token
      }

      // Guardamos la contraseña maestra en memoria temporal
      setMasterPassword(password)

      submitted.value = true
      navigateTo('/boveda')
    } catch (error) {
      console.error('Login failed:', error)
      submitted.value = false
    }
  }

  function resetFeedback() {
    submitted.value = false
  }

  return { schema, fields, providers, submitted, onSubmit, resetFeedback }
}
