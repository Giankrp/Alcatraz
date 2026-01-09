import type { VaultItem, VaultItemDTO } from '~/types/vault'
const host = "localhost:8080"
export const useVault = () => {
  const { encryptData, decryptData } = useCrypto()
  const { masterPassword } = useMasterPassword()
  
  const searchQuery = useState<string>('vault-search', () => '')
  const items = useState<VaultItem[]>('vault-items', () => [])

  // Helper para separar datos sensibles de metadatos
  const extractSensitiveData = (item: Partial<VaultItem>) => {
    const { id, title, folder, trashed, icon, type, ...sensitive } = item
    return sensitive
  }

  const fetchItems = async () => {
    if (!masterPassword.value) {
      console.warn('Master password not set. Cannot decrypt items.')
      return
    }

    try {
      const dtos = await $fetch<any[]>(`http://${host}/vault/items`)
      console.log('Received DTOs:', dtos)
      
      const decryptedItems: VaultItem[] = []
      
      for (const rawDto of dtos) {
        // Normalizar claves (snake_case vs PascalCase)
        const dto: VaultItemDTO = {
            id: rawDto.id || rawDto.ID,
            type: rawDto.type || rawDto.Type,
            title: rawDto.title || rawDto.Title,
            icon: rawDto.icon || rawDto.Icon,
            folder_id: rawDto.folder_id || rawDto.FolderId || rawDto.folderId,
            trashed: rawDto.trashed ?? rawDto.Trashed ?? false,
            encrypted_data: rawDto.encrypted_data || rawDto.EncryptedData,
            iv: rawDto.iv || rawDto.IV || rawDto.Iv,
            salt: rawDto.salt || rawDto.Salt
        }

        try {
          // Descifrar el blob
          if (!dto.encrypted_data || !dto.iv || !dto.salt) {
             throw new Error('Missing crypto fields in DTO')
          }

          const sensitiveData = await decryptData(
            { 
              blob: dto.encrypted_data, 
              iv: dto.iv, 
              salt: dto.salt 
            }, 
            masterPassword.value
          )

          // Reconstruir el item completo para la UI
          decryptedItems.push({
            id: dto.id,
            type: dto.type,
            title: dto.title,
            icon: dto.icon,
            folder: dto.folder_id || 'personal', // Asumiendo folder_id string
            trashed: dto.trashed,
            ...sensitiveData // username, password, note, etc.
          } as VaultItem)

        } catch (err) {
          console.error(`Failed to decrypt item ${dto.id}:`, err)
          // Podríamos mostrar items corruptos/bloqueados en la UI en lugar de ignorarlos
        }
      }

      items.value = decryptedItems
    } catch (error) {
      console.error('Error fetching vault items:', error)
    }
  }

  const addItem = async (item: Omit<VaultItem, 'id' | 'icon' | 'trashed'>) => {
    if (!masterPassword.value) throw new Error('Vault locked')

    try {
      // 1. Preparar metadatos
      let icon = 'i-heroicons-question-mark-circle'
      if (item.type === 'password') icon = 'i-heroicons-key'
      if (item.type === 'note') icon = 'i-heroicons-document-text'
      if (item.type === 'card') icon = 'i-heroicons-credit-card'
      if (item.type === 'identity') icon = 'i-heroicons-user-circle'

      // 2. Cifrar datos sensibles
      const sensitiveData = extractSensitiveData(item as VaultItem)
      const cryptoResult = await encryptData(sensitiveData, masterPassword.value)

      // 3. Crear DTO para backend
      const payload = {
        title: item.title,
        type: item.type,
        folder_id: item.folder,
        icon: icon,
        encrypted_data: cryptoResult.blob,
        iv: cryptoResult.iv,
        salt: cryptoResult.salt
      }

      // 4. Enviar
      const rawResponse = await $fetch<VaultItem>(`http://${host}/vault/items`, {
        method: 'POST',
        body: payload
      })

      // 5. Actualizar UI (usamos los datos que ya tenemos en memoria + ID del server)
      const newItem: VaultItem = {
        ...item,
        id: rawResponse.id || '',
        icon,
        trashed: false
      } as VaultItem

      items.value.unshift(newItem)
      return newItem
    } catch (error) {
      console.error('Error adding item:', error)
      throw error
    }
  }

  const updateItem = async (id: string, updatedFields: Partial<VaultItem>) => {
    if (!masterPassword.value) throw new Error('Vault locked')

    try {
      const index = items.value.findIndex(i => i.id === id)
      if (index === -1) return

      // Fusionar cambios en memoria para obtener el estado final deseado
      const currentItem = items.value[index]
      const mergedItem = { ...currentItem, ...updatedFields } as VaultItem
      
      // Preparar payload
      const payload: any = {}
      
      // Si cambiaron metadatos planos
      if (updatedFields.title) payload.title = updatedFields.title
      if (updatedFields.folder) payload.folder_id = updatedFields.folder
      if (updatedFields.trashed !== undefined) payload.trashed = updatedFields.trashed
      // Nota: type no suele cambiar

      // Si cambiaron datos sensibles, hay que re-cifrar TODO el bloque sensible
      // Detectar si hay cambios en campos sensibles es complejo, así que por seguridad
      // re-ciframos siempre que sea una edición de contenido.
      const sensitiveKeys = ['username', 'password', 'url', 'note', 'number', 'cvv', 'firstName', 'licenseNumber']
      const hasSensitiveChanges = Object.keys(updatedFields).some(k => sensitiveKeys.includes(k))

      if (hasSensitiveChanges || updatedFields.title) { // Si editamos, re-ciframos para rotar IV/Salt también (buena práctica)
         const sensitiveData = extractSensitiveData(mergedItem)
         const cryptoResult = await encryptData(sensitiveData, masterPassword.value)
         
         payload.encrypted_data = cryptoResult.blob
         payload.iv = cryptoResult.iv
         payload.salt = cryptoResult.salt
      }

      // Enviar al backend
      await $fetch<VaultItem>(`http://${host}/vault/items/${id}`, {
        method: 'PUT',
        body: payload
      })

      // Actualizar UI
      if (items.value[index]) {
        Object.assign(items.value[index], updatedFields)
      }

    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }

  const removeItem = async (id: string) => {
    await updateItem(id, { trashed: true })
  }

  const restoreItem = async (id: string) => {
    await updateItem(id, { trashed: false })
  }

  const deleteItemPermanent = async (id: string) => {
    try {
      await $fetch(`http://${host}/vault/items/${id}`, { method: 'DELETE' })
      items.value = items.value.filter(i => i.id !== id)
    } catch (error) {
      console.error('Error deleting item permanently:', error)
      throw error
    }
  }

  return {
    items,
    searchQuery,
    fetchItems,
    addItem,
    updateItem,
    removeItem,
    restoreItem,
    deleteItemPermanent
  }
}
