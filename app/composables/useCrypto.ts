export const useCrypto = () => {
  // Configuración de seguridad estándar militar

  const ALGORITHM = { name: 'AES-GCM', length: 256 }
  const HASH = 'SHA-256'
  const ITERATIONS = 100000 // Alto número de iteraciones para resistir fuerza bruta

  // Utilidades para convertir ArrayBuffer a Base64 y viceversa
  const bufferToBase64 = (buffer: ArrayBuffer): string => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
  }

  const base64ToBuffer = (base64: string): Uint8Array => {
    try {
      // Limpiar y normalizar la cadena Base64
      let cleanBase64 = base64.replace(/[\n\r\s]/g, '') // Eliminar espacios
      cleanBase64 = cleanBase64.replace(/-/g, '+').replace(/_/g, '/') // Convertir URL-safe a estándar
      
      // Añadir padding si es necesario
      while (cleanBase64.length % 4) {
        cleanBase64 += '='
      }

      const binaryString = atob(cleanBase64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return bytes
    } catch (e) {
      console.error('base64ToBuffer failed for input:', base64)
      throw e
    }
  }

  /**
   * Deriva una clave criptográfica segura a partir de la contraseña maestra
   */
  const deriveKey = async (password: string, salt: BufferSource): Promise<CryptoKey> => {
    const enc = new TextEncoder()
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations: ITERATIONS,
        hash: HASH
      },
      keyMaterial,
      ALGORITHM,
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Cifra cualquier objeto JSON en un blob seguro
   */
  const encryptData = async (data: any, masterPassword: string) => {
    try {
      const salt = window.crypto.getRandomValues(new Uint8Array(16))
      const iv = window.crypto.getRandomValues(new Uint8Array(12))
      const key = await deriveKey(masterPassword, salt)
      const enc = new TextEncoder()
      const encodedData = enc.encode(JSON.stringify(data))

      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encodedData
      )

      return {
        salt: bufferToBase64(salt.buffer),
        iv: bufferToBase64(iv.buffer),
        blob: bufferToBase64(encryptedContent)
      }
    } catch (error) {
      console.error('Crypto error:', error)
      throw new Error('Encryption failed')
    }
  }

  /**
   * Descifra el blob recibido
   */
  const decryptData = async (encryptedPackage: { blob: string, iv: string, salt: string }, masterPassword: string) => {
    try {
      const salt = base64ToBuffer(encryptedPackage.salt)
      const iv = base64ToBuffer(encryptedPackage.iv)
      const ciphertext = base64ToBuffer(encryptedPackage.blob)
      const key = await deriveKey(masterPassword, salt as BufferSource)

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv as BufferSource },
        key,
        ciphertext as BufferSource
      )

      const dec = new TextDecoder()
      return JSON.parse(dec.decode(decryptedBuffer))
    } catch (error) {
      console.error('Decryption error:', error)
      throw new Error('Decryption failed or wrong password')
    }
  }

  return {
    encryptData,
    decryptData
  }
}
