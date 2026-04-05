import { onMounted, onUnmounted } from 'vue'

export const useAutoLock = (timeoutMinutes: number = 5) => {
  const { clearMasterPassword } = useMasterPassword()
  const timeoutMs = timeoutMinutes * 60 * 1000
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const lockVault = () => {
    // Si el usuario superó el tiempo inactivo, disparamos el protocolo Zero-Knowledge
    clearMasterPassword()
    navigateTo('/login/unlock')
  }

  const resetTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(lockVault, timeoutMs)
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // Si el usuario cambia de pestaña, seguimos usando el mismo contador (estricto pero flexible)
      // Si excede sus 5 min y vuelve, o si nunca vuelve, se auto-bloquea.
    } else {
      resetTimer()
    }
  }

  // Lista pura de eventos DOM que denotan "El usuario está vivo e interactuando con la interfaz"
  const events = ['mousemove', 'keydown', 'wheel', 'touchstart', 'pointerdown']

  onMounted(() => {
    // 1. Iniciamos el cronómetro cuando el composable se monta (ej. entrando a la boveda)
    resetTimer()

    // 2. Adjuntamos listeners muy eficientes al objeto global window
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true })
    })

    // 3. Reaccionar a cambios bruscos de la pestaña del navegador
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    // Limpieza agresiva: evitar fugas de memoria si salimos del Layout de forma programática
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    events.forEach(event => {
      window.removeEventListener(event, resetTimer)
    })
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  return { resetTimer, lockVault }
}
