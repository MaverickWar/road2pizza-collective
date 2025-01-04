export interface Database {
  public: {
    Tables: {
      forum_threads: {
        Row: {
          id: string
          category_id: string | null
          title: string
          content: string
          is_pinned: boolean
          is_locked: boolean
          view_count: number
          created_at: string
          updated_at: string
          created_by: string | null
          last_post_at: string
          forum_id: string | null
          slug: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          content: string
          is_pinned?: boolean
          is_locked?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
          last_post_at?: string
          forum_id?: string | null
          slug?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          content?: string
          is_pinned?: boolean
          is_locked?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
          created_by?: string | null
          last_post_at?: string
          forum_id?: string | null
          slug?: string | null
        }
      }
      forum_posts: {
        Row: {
          id: string
          thread_id: string
          content: string
          created_by: string | null
          created_at: string
          updated_at: string
          is_solution: boolean
          is_edited: boolean
          likes_count: number
          is_reported: boolean
          is_removed: boolean
        }
      }
      forums: {
        Row: {
          id: string
          title: string
          description: string | null
          category_id: string | null
          category?: {
            id: string
            name: string
          }
        }
      }
      pizza_types: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          created_at: string
          created_by: string | null
          updated_at: string
          slug: string
          display_order: number
          is_hidden: boolean
        }
      }
    }
    Enums: {}
  }
}