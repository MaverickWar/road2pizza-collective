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
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  category_id: string | null;
  forum_id: string | null;
  view_count: number;
  last_post_at: string;
  slug: string | null;
  forum?: {
    title: string;
    description: string | null;
  };
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
  posts?: {
    id: string;
    content: string;
    created_at: string;
    created_by: string;
  }[];
}