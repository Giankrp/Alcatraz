export const usePasswordGenerator = () => {
  const password = ref('')
  const length = ref(16)
  const includeUppercase = ref(true)
  const includeNumbers = ref(true)
  const includeSymbols = ref(true)

  // 2. Diccionarios de caracteres
  const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
  const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const NUMBERS = '0123456789'
  const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-='

  // 3. Función generadora
  const generatePassword = () => {
    let charset = LOWERCASE
    if (includeUppercase.value) charset += UPPERCASE
    if (includeNumbers.value) charset += NUMBERS
    if (includeSymbols.value) charset += SYMBOLS

    if (charset.length === 0) return ''

    let generatedPassword = ''

    // Usamos crypto para mayor seguridad en lugar de Math.random()
    const randomValues = new Uint32Array(length.value)
    window.crypto.getRandomValues(randomValues)

    for (let i = 0; i < length.value; i++) {

      // Convertimos el número aleatorio a un índice válido del charset
      const val = randomValues[i]
      if (val === undefined) continue // TS safety (though guaranteed by length loop)
      const randomIndex = val % charset.length
      generatedPassword += charset[randomIndex]
    }

    password.value = generatedPassword
  }

  // 4. Utilidad para copiar al portapapeles
  const copyToClipboard = async () => {
    if (!password.value) return false
    try {
      await navigator.clipboard.writeText(password.value)
      return true
    } catch (err) {
      console.error('Error al copiar: ', err)
      return false
    }
  }

  // Generar una contraseña inicial al cargar el composable
  generatePassword()

  return {
    password,
    length,
    includeUppercase,
    includeNumbers,
    includeSymbols,
    generatePassword,
    copyToClipboard
  }
}
