import { Database } from '@/integrations/supabase/types/generated';

type DBThread = Database['public']['Tables']['forum_threads']['Row'];
type DBPost = Database['public']['Tables']['forum_posts']['Row'];
type DBForum = Database['public']['Tables']['forums']['Row'];

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
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
  posts?: Post[];
}

export interface Post extends DBPost {
  user?: {
    username: string;
  };
}

export interface Forum extends DBForum {
  category?: {
    id: string;
    name: string;
  };
}

export interface ForumSettings {
  id: number;
  allow_guest_viewing: boolean | null;
  require_approval: boolean | null;
  auto_lock_inactive: boolean | null;
  created_at: string;
  updated_at: string;
}