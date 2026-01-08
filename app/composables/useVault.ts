import type { VaultItem, VaultItemType } from '~/types/vault'

export const useVault = () => {
  const items = useState<VaultItem[]>('vault-items', () => [
    { id: 1, title: 'GitHub', username: 'user@example.com', url: 'https://github.com', icon: 'i-heroicons-code-bracket', type: 'password', folder: 'work', trashed: false },
    { id: 2, title: 'Gmail', username: 'user@example.com', url: 'https://mail.google.com', icon: 'i-heroicons-envelope', type: 'password', folder: 'personal', trashed: false },
    { id: 3, title: 'Banco', username: 'user@bank.com', url: 'https://bank.example', icon: 'i-heroicons-shield-check', type: 'password', folder: 'personal', trashed: false },
    { id: 4, title: 'Visa', holder: 'Juan Perez', number: '1234 5678 9345 1234', expiry: '12/25', cvv: '123', icon: 'i-heroicons-credit-card', type: 'card', folder: 'personal', trashed: false },
    { id: 5, title: 'Nota Segura', note: 'Nota confidencial', icon: 'i-heroicons-document-text', type: 'note', folder: 'work', trashed: false },
    { id: 6, title: 'Perfil Personal', firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com', phone: '123456789', address: 'Calle 123', icon: 'i-heroicons-user-circle', type: 'identity', folder: 'personal', trashed: false },
    // Mock items adjusted to match interfaces
  ])

  const searchQuery = useState<string>('vault-search', () => '')

  const addItem = (item: Omit<VaultItem, 'id' | 'icon' | 'trashed'>) => {
    const newId = items.value.length > 0 ? Math.max(...items.value.map(i => i.id || 0)) + 1 : 1
    
    let icon = 'i-heroicons-question-mark-circle'
    if (item.type === 'password') icon = 'i-heroicons-key'
    if (item.type === 'note') icon = 'i-heroicons-document-text'
    if (item.type === 'card') icon = 'i-heroicons-credit-card'
    if (item.type === 'identity') icon = 'i-heroicons-user-circle'

    // We need to cast because the input item is a union, but we are constructing a full object.
    // In a real app, we might want a factory function per type.
    const newItem = {
      ...item,
      id: newId,
      icon,
      trashed: false
    } as VaultItem

    items.value.unshift(newItem)
  }

  const removeItem = (id: number) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.trashed = true
    }
  }

  const restoreItem = (id: number) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.trashed = false
    }
  }

  const deleteItemPermanent = (id: number) => {
    items.value = items.value.filter(i => i.id !== id)
  }

  const updateItem = (id: number, updatedFields: Partial<VaultItem>) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      Object.assign(item, updatedFields)
    }
  }

  return {
    items,
    searchQuery,
    addItem,
    removeItem,
    restoreItem,
    deleteItemPermanent,
    updateItem
  }
}
