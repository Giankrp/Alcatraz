import type { VaultItem } from '~/types/vault'
export const useVault = () => {
  const config = useRuntimeConfig()
  const authToken = useCookie('auth_token', { httpOnly: true })
  const { encryptData, decryptData } = useCrypto()
  const { masterPassword } = useMasterPassword()

  const searchQuery = useState<string>('vault-search', () => '')
  const items = useState<VaultItem[]>('vault-items', () => [])

  // Helper para separar datos sensibles de metadatos
  const extractSensitiveData = (item: Partial<VaultItem>) => {
    const { id, title, folder, trashed, icon, item_type, encrypted_data, iv, salt, ...sensitive } = item
    return sensitive
  }

  const fetchItems = async () => {
    if (!masterPassword.value) {
      console.warn('Master password not set. Cannot fetch items.')
      return
    }

    try {
      const dtos = await $fetch<any[]>(`${config.public.apiBase}/api/vault/items`, {
        headers: {
          Authorization: `Bearer ${authToken.value}`
        }
      })

      const mappedItems: VaultItem[] = dtos.map(rawDto => {
        // Normalizar claves (snake_case vs PascalCase)
        return {
          id: rawDto.id || rawDto.ID,
          item_type: rawDto.item_type || rawDto.ItemType,
          title: rawDto.title || rawDto.Title,
          icon: rawDto.icon || rawDto.Icon,
          folder: rawDto.folder_id || rawDto.FolderId || rawDto.folderId || 'personal',
          trashed: rawDto.trashed ?? rawDto.Trashed ?? false,

          // Guardar datos cifrados para descifrar bajo demanda
          encrypted_data: rawDto.encrypted_data || rawDto.EncryptedData,
          iv: rawDto.iv || rawDto.IV || rawDto.Iv,
          salt: rawDto.salt || rawDto.Salt
        } as VaultItem
      })

      items.value = mappedItems
    } catch (error) {
      console.error('Error fetching vault items:', error)
    }
  }

  const getDecryptedItem = async (id: string): Promise<VaultItem | undefined> => {
    const item = items.value.find(i => i.id === id)
    if (!item) return undefined

    // Si ya tiene algún campo sensible específico descifrado, asumo que está listo
    if (item.item_type === 'password' && (item as any).username) return item
    if (item.item_type === 'note' && (item as any).note) return item;
    if (item.item_type === 'card' && (item as any).number) return item;
    if (item.item_type === 'identity' && (item as any).firstName) return item;

    // Si NO tiene los datos cifrados (lazy loading), los pido al backend
    if (!item.encrypted_data) {
      try {
        const detail = await $fetch<any>(`${config.public.apiBase}/api/vault/items/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken.value}`
          }
        })
        const { EncryptedData, IV, Salt } = detail.Secret
        //  console.log('Item details:', detail.ID)
        // Actualizo con los datos cifrados que acaban de llegar
        item.encrypted_data = EncryptedData
        item.iv = IV
        item.salt = Salt
      } catch (e) {
        console.error("Error fetching item details", e)
        throw e
      }
    }

    if (!masterPassword.value) throw new Error('Vault locked')

    try {
      const sensitiveData = await decryptData(
        {
          blob: item.encrypted_data!,
          iv: item.iv!,
          salt: item.salt!
        },
        masterPassword.value
      )

      // Actualizar el item en el array reactivo con los datos descifrados
      Object.assign(item, sensitiveData)

      // Limpiar datos cifrados de memoria (opcional, pero buena práctica)
      delete item.encrypted_data
      delete item.iv
      delete item.salt

      return item
    } catch (error) {
      console.error(`Failed to decrypt item ${id}:`, error)
      throw error
    }
  }

  const addItem = async (item: Omit<VaultItem, 'id' | 'icon' | 'trashed'>) => {
    if (!masterPassword.value) throw new Error('Vault locked')

    try {
      // 1. Preparar metadatos
      let icon = 'i-heroicons-question-mark-circle'
      if (item.item_type === 'password') icon = 'i-heroicons-key'
      if (item.item_type === 'note') icon = 'i-heroicons-document-text'
      if (item.item_type === 'card') icon = 'i-heroicons-credit-card'
      if (item.item_type === 'identity') icon = 'i-heroicons-user-circle'

      // 2. Cifrar datos sensibles
      const sensitiveData = extractSensitiveData(item as VaultItem)
      const cryptoResult = await encryptData(sensitiveData, masterPassword.value)

      // 3. Crear DTO para backend
      const payload = {
        title: item.title,
        type: item.item_type,
        folder_id: item.folder === 'personal' || item.folder === 'work' ? null : item.folder, // Handle magic strings for now
        icon: icon,
        secret: {
          Data: cryptoResult.encrypted_data,
          Iv: cryptoResult.iv,
          Salt: cryptoResult.salt
        }
      }



      // 4. Enviar
      const rawResponse = await $fetch<VaultItem>(`${config.public.apiBase}/api/vault/items`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken.value}`
        },
        body: payload
      })

      // 5. Actualizar UI (usamos los datos que ya tenemos en memoria + ID del server)
      console.log('AddItem Response:', rawResponse)
      const newItem: VaultItem = {
        ...item,
        id: rawResponse.id || (rawResponse as any).ID || '',
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
      let currentItem = items.value[index]
      if (!currentItem) return

      // Detectar si necesitamos re-cifrar (cambio de título o campos sensibles)
      const sensitiveKeys = ['username', 'password', 'url', 'note', 'number', 'cvv', 'firstName', 'licenseNumber']
      const hasSensitiveChanges = Object.keys(updatedFields).some(k => sensitiveKeys.includes(k))
      const needReEncryption = hasSensitiveChanges || updatedFields.title

      // Si hay que re-cifrar, aseguramos que tenemos todos los datos (descifrados)
      // para no sobrescribir el secreto con datos incompletos.
      if (needReEncryption) {
        await getDecryptedItem(id)
        // Refrescar referencia tras la mutación asíncrona
        currentItem = items.value[index]
      }

      const mergedItem = { ...currentItem, ...updatedFields } as VaultItem

      // Preparar payload
      const payload: any = {}

      // Si cambiaron metadatos planos
      if (updatedFields.title) payload.title = updatedFields.title
      if (updatedFields.folder) payload.folder_id = updatedFields.folder === 'personal' || updatedFields.folder === 'work' ? null : updatedFields.folder
      if (updatedFields.trashed !== undefined) payload.trashed = updatedFields.trashed
      // Nota: item_type no suele cambiar

      if (needReEncryption) { // Si editamos, re-ciframos para rotar IV/Salt también (buena práctica)
        const sensitiveData = extractSensitiveData(mergedItem)
        const cryptoResult = await encryptData(sensitiveData, masterPassword.value)

        payload.secret = {
          Data: cryptoResult.encrypted_data,
          Iv: cryptoResult.iv,
          Salt: cryptoResult.salt
        }
      }

      // Enviar al backend
      await $fetch<VaultItem>(`${config.public.apiBase}/api/vault/items/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken.value}`
        },
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
      await $fetch(`${config.public.apiBase}/api/vault/items/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken.value}`
        }
      })
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
    deleteItemPermanent,
    getDecryptedItem
  }
}
