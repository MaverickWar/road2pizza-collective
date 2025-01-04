import { Database } from '@/integrations/supabase/types/generated';

export type Thread = Database['public']['Tables']['forum_threads']['Row'] & {
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
};

export type Post = Database['public']['Tables']['forum_posts']['Row'] & {
  user?: {
    username: string;
  };
};

export interface ForumSettings {
  allow_guest_viewing: boolean;
  require_approval: boolean;
  auto_lock_inactive: boolean;
}