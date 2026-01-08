export type VaultItemType = 'password' | 'note' | 'card' | 'identity';

// Interfaz base tal como viene del Backend (datos cifrados)
export interface VaultItemDTO {
  id: string;
  folder_id?: string;
  type: VaultItemType;
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
  type: VaultItemType;
}

export interface PasswordItem extends BaseVaultItemUI {
  type: 'password';
  username: string;
  password?: string;
  url?: string;
}

export interface NoteItem extends BaseVaultItemUI {
  type: 'note';
  note: string;
}

export interface CardItem extends BaseVaultItemUI {
  type: 'card';
  holder: string;
  number: string;
  expiry: string;
  cvv: string;
}

export interface IdentityItem extends BaseVaultItemUI {
  type: 'identity';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber?: string;
  passportNumber?: string;
}

export type VaultItem = PasswordItem | NoteItem | CardItem | IdentityItem;
