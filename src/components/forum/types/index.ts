export interface ForumSettings {
  id: number;
  allow_guest_viewing: boolean;
  require_approval: boolean;
  auto_lock_inactive: boolean;
  created_at: string;
  updated_at: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_locked: boolean;
  is_pinned: boolean;
  forum?: {
    id: string;
    title: string;
    description: string | null;
  };
  author?: {
    username: string;
    avatar_url: string | null;
  };
}