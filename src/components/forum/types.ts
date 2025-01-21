import { Database } from '@/integrations/supabase/types';

type DBThread = Database['public']['Tables']['forum_threads']['Row'];
type DBPost = Database['public']['Tables']['forum_posts']['Row'];
type DBForum = Database['public']['Tables']['forums']['Row'];
type DBForumSettings = Database['public']['Tables']['forum_settings']['Row'];

export interface Thread extends DBThread {
  forum?: {
    id: string;
    title: string;
    description?: string | null;
    category?: {
      id: string;
      name: string;
    };
  };
  author?: {
    username: string;
    avatar_url?: string | null;
    created_at: string;
    points?: number;
    badge_title?: string;
    badge_color?: string;
    is_admin?: boolean;
    is_staff?: boolean;
  };
  posts?: {
    id: string;
    thread_id: string;
    content: string;
    created_at: string;
    created_by: string | null;
    updated_at: string;
    is_solution?: boolean | null;
    is_edited?: boolean | null;
    likes_count?: number | null;
    is_reported?: boolean | null;
    is_removed?: boolean | null;
    count?: number;
    user?: {
      username: string;
      avatar_url?: string | null;
      is_admin?: boolean;
      is_staff?: boolean;
      points?: number;
      badge_title?: string;
      badge_color?: string;
    };
  }[];
}

export interface Post extends DBPost {
  thread_id: string;
  user?: {
    username: string;
    avatar_url?: string | null;
    is_admin?: boolean;
    is_staff?: boolean;
    points?: number;
    badge_title?: string;
    badge_color?: string;
  };
  is_pinned?: boolean;
  count?: number;
}

export interface Forum extends DBForum {
  category?: {
    id: string;
    name: string;
  };
}

export interface ForumSettings extends DBForumSettings {
  id: number;
  allow_guest_viewing: boolean | null;
  require_approval: boolean | null;
  auto_lock_inactive: boolean | null;
  created_at: string;
  updated_at: string;
}