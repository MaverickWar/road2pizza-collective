export interface Database {
  public: {
    Tables: {
      forum_threads: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          content: string;
          is_pinned: boolean | null;
          is_locked: boolean | null;
          view_count: number | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          last_post_at: string;
          forum_id: string | null;
          slug: string | null;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          title: string;
          content: string;
          is_pinned?: boolean | null;
          is_locked?: boolean | null;
          view_count?: number | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          last_post_at?: string;
          forum_id?: string | null;
          slug?: string | null;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          title?: string;
          content?: string;
          is_pinned?: boolean | null;
          is_locked?: boolean | null;
          view_count?: number | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          last_post_at?: string;
          forum_id?: string | null;
          slug?: string | null;
        };
      };
      forum_posts: {
        Row: {
          id: string;
          thread_id: string;
          content: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          is_solution: boolean | null;
          is_edited: boolean | null;
          likes_count: number | null;
          is_reported: boolean | null;
          is_removed: boolean | null;
        };
      };
      forums: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          description: string | null;
          slug: string;
          display_order: number | null;
          created_at: string;
          created_by: string | null;
          updated_at: string;
        };
      };
      forum_settings: {
        Row: {
          id: number;
          allow_guest_viewing: boolean | null;
          require_approval: boolean | null;
          auto_lock_inactive: boolean | null;
          created_at: string;
          updated_at: string;
        };
      };
      pizza_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          created_by: string | null;
          updated_at: string;
          slug: string;
          display_order: number | null;
          is_hidden: boolean | null;
        };
      };
    };
  };
}