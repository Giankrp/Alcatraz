export type VaultItemType = 'password' | 'note' | 'card' | 'identity';

export interface BaseVaultItem {
  id?: number;
  title: string;
  folder: string;
  trashed?: boolean;
  icon: string;
}

export interface PasswordItem extends BaseVaultItem {
  type: 'password';
  username: string;
  password?: string;
  url?: string;
}

export interface NoteItem extends BaseVaultItem {
  type: 'note';
  note: string;
}

export interface CardItem extends BaseVaultItem {
  type: 'card';
  holder: string;
  number: string;
  expiry: string;
  cvv: string;
}

export interface IdentityItem extends BaseVaultItem {
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
