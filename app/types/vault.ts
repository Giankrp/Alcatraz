export type VaultItemType = 'password' | 'note' | 'card' | 'identity';

// Interfaz base tal como viene del Backend (datos cifrados)
export interface VaultItemDTO {
  id: string;
  folder_id?: string;
  item_type: VaultItemType; // Backend usa snake_case
  title: string;
  icon: string;
  trashed: boolean;
  
  // Datos de seguridad
  encrypted_data: string;
  iv: string;
  salt: string;
  
  created_at?: string;
  updated_at?: string;
}

// Interfaces de UI (Datos descifrados en memoria)
export interface BaseVaultItemUI {
  id?: string; // Opcional al crear, string (UUID) al recibir
  title: string;
  folder: string;
  trashed?: boolean;
  icon: string;
  item_type: VaultItemType; // Frontend usa 'type' consistentemente
}

export interface PasswordItem extends BaseVaultItemUI {
  item_type: 'password';
  username: string;
  password?: string;
  url?: string;
}

export interface NoteItem extends BaseVaultItemUI {
  item_type: 'note';
  note: string;
}

export interface CardItem extends BaseVaultItemUI {
  item_type: 'card';
  holder: string;
  number: string;
  expiry: string;
  cvv: string;
}

export interface IdentityItem extends BaseVaultItemUI {
  item_type: 'identity';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber?: string;
  passportNumber?: string;
}

export type VaultItem = PasswordItem | NoteItem | CardItem | IdentityItem;
