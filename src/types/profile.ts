export interface Profile {
  username: string;
}

export interface ProfileChangeRequest {
  id: string;
  user_id: string;
  requested_username?: string | null;
  requested_email?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string | null;
  reviewed_by?: string | null;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
  } | null;
}