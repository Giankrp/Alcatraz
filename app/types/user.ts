export interface UserProfile {
  user_id: string;
  name: string;
  avatar_url: string;
  language: string;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileDTO {
  name?: string;
  avatar_url?: string;
  language?: string;
}
