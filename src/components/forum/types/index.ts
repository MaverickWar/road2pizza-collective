export interface ForumSettings {
  id: number;
  allow_guest_viewing: boolean | null;
  require_approval: boolean | null;
  auto_lock_inactive: boolean | null;
  created_at: string;
  updated_at: string;
}