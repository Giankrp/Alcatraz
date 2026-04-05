export const useMasterPassword = () => {
  // En una app real, esto se setea tras el login y se borra al cerrar sesión/timeout.
  // NUNCA persistir esto en disco/localStorage.
  const masterPassword = useState<string | null>('master-password', () => null)

  // Email del usuario en memoria — permite que /login/unlock funcione
  // tanto para usuarios OAuth como para usuarios con email/password directo.
  const userEmail = useState<string | null>('user-email', () => null)

  const setMasterPassword = (password: string) => {
    masterPassword.value = password
  }

  const clearMasterPassword = () => {
    masterPassword.value = null
  }

  const setUserEmail = (email: string) => {
    userEmail.value = email
  }

  const clearUserEmail = () => {
    userEmail.value = null
  }

  return {
    masterPassword,
    userEmail,
    setMasterPassword,
    clearMasterPassword,
    setUserEmail,
    clearUserEmail
  }
}
