export type VaultItemType = 'password' | 'note' | 'card' | 'identity' | 'document';

// --- DATA TRANSFER OBJECTS (API Payload/Response) ---

export interface SecretDTO {
  data: string;
  iv: string;
  salt: string;
}

export interface CreateVaultItemDTO {
  folder_id: string | null;
  type: VaultItemType; // Backend creation DTO uses "type"
  title: string;
  icon: string;
  secret: SecretDTO;
}

export interface UpdateVaultItemDTO {
  folder_id?: string | null;
  type?: VaultItemType;
  title?: string;
  icon?: string;
  trashed?: boolean;
  secret: SecretDTO;
}

export interface VaultItemResponse {
  id: string;
  user_id: string;
  folder_id: string | null;
  item_type: VaultItemType; // API response uses "item_type"
  title: string;
  icon: string;
  trashed: boolean;
  secret?: {
    encrypted_data: string;
    iv: string;
    salt: string;
  };
  created_at: string;
  updated_at: string;
}

export interface VaultFolderDTO {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
}

export interface CreateVaultFolderDTO {
  name: string;
  is_default?: boolean;
}

export interface UpdateVaultFolderDTO {
  name: string;
}

// --- UI / STATE MODELS (Decrypted memory storage) ---

export interface VaultFolder {
  id: string;
  name: string;
  is_default: boolean;
  created_at?: string;
}

export interface BaseVaultItemUI {
  id: string;
  title: string;
  folder: string; // Used for UI lookups/filtering (UUID)
  trashed: boolean;
  icon: string;
  item_type: VaultItemType;
  
  // Timestamps (from API)
  created_at?: string;
  updated_at?: string;

  // Encrypted state (if not yet decrypted)
  encrypted_data?: string;
  iv?: string;
  salt?: string;
}

export interface PasswordItem extends BaseVaultItemUI {
  item_type: 'password';
  username?: string;
  password?: string;
  url?: string;
}

export interface NoteItem extends BaseVaultItemUI {
  item_type: 'note';
  note?: string;
}

export interface CardItem extends BaseVaultItemUI {
  item_type: 'card';
  holder?: string;
  number?: string;
  expiry?: string;
  cvv?: string;
}

export interface IdentityItem extends BaseVaultItemUI {
  item_type: 'identity';
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  licenseNumber?: string;
  passportNumber?: string;
}

export interface DocumentItem extends BaseVaultItemUI {
  item_type: 'document';
  fileName?: string;
  fileData?: string;
  mimeType?: string;
}

export type VaultItem = PasswordItem | NoteItem | CardItem | IdentityItem | DocumentItem;
