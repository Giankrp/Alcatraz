export const useMasterPassword = () => {
  // En una app real, esto se setea tras el login y se borra al cerrar sesión/timeout.
  // NUNCA persistir esto en disco/localStorage.
  const masterPassword = useState<string | null>('master-password', () => null)

  const setMasterPassword = (password: string) => {
    masterPassword.value = password
  }

  const clearMasterPassword = () => {
    masterPassword.value = null
  }

  return {
    masterPassword,
    setMasterPassword,
    clearMasterPassword
  }
}
