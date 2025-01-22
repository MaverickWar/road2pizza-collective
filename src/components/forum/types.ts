export interface Thread {
  id: string;
  title: string;
  content: string;
  is_pinned?: boolean;
  is_locked?: boolean;
  category_id?: string;
  created_at: string;
  view_count: number;
  created_by: string;
  post_count?: number;
  last_post_at?: string;
  last_post_by?: string;
  author?: {
    username: string;
    avatar_url?: string;
    created_at: string;
    points?: number;
    badge_title?: string;
    badge_color?: string;
    is_admin?: boolean;
    is_staff?: boolean;
  };
  last_poster?: {
    username: string;
    avatar_url?: string;
  };
  posts?: ForumPost[];
  forum?: {
    title?: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

export interface ForumPost {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  count?: number;
  is_pinned?: boolean;
  user?: {
    username: string;
    avatar_url?: string;
    is_admin?: boolean;
    is_staff?: boolean;
  };
}