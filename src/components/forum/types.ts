import { Tables } from '@/integrations/supabase/types/database';

export interface Post extends Tables<'forum_posts'> {
  user?: {
    username: string;
  };
}

export interface Thread extends Tables<'forum_threads'> {
  forum?: {
    id: string;
    title: string;
    description?: string;
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

export interface ForumSettings extends Tables<'forum_settings'> {
  allow_guest_viewing: boolean;
  require_approval: boolean;
  auto_lock_inactive: boolean;
}