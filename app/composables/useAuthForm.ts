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
      onClick: () => { signIn('google', { callbackUrl: '/login/unlock' }) },
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
      onClick: () => { signIn('github', { callbackUrl: '/login/unlock' }) },
      ui: {
        base: 'hover:cursor-pointer'
      }
    },
  ])

  const { setMasterPassword, setUserEmail } = useMasterPassword()
  const submitted = ref(false)
  const error = ref(false)

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    submitted.value = false
    try {
      const { email, password } = event.data
      const config = useRuntimeConfig()

      // Llamada real al backend
      await $fetch<any>(`${config.public.apiBase}/api/auth/login`, {
        method: 'POST',
        body: { email, password },
        credentials: 'include'
      })



      // Guardamos la contraseña maestra y el email en memoria temporal
      setMasterPassword(password)
      setUserEmail(email)

      submitted.value = true
      navigateTo('/boveda')
    } catch (e) {
      console.error('Login failed:', e)
      error.value = true
      submitted.value = false
    }
  }

  function resetFeedback() {
    submitted.value = false
    error.value = false
  }

  return { schema, fields, providers, submitted, error, onSubmit, resetFeedback }
}
