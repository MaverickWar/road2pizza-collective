export interface Profile {
  id: string;
  username: string;
  email?: string;
  is_admin: boolean;
  is_staff: boolean;
  is_suspended: boolean;
  created_at: string;
  points: number;
  badge_count: number;
  recipes_shared: number;
  badge_title?: string;
  badge_color?: string;
  bio?: string;
  avatar_url?: string;
  is_verified: boolean;
  requires_recipe_approval: boolean;
}

export interface ProfileChangeRequest {
  id: string;
  user_id: string;
  requested_username?: string;
  requested_email?: string;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
  };
}