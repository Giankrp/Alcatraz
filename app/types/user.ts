export interface UserProfile {
  user_id: string;
  name: string;
  avatar_url: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileDTO {
  name?: string;
  avatar_url?: string;
  language?: string;
}
