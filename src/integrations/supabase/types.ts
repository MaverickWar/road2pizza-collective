export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_metrics: {
        Row: {
          endpoint_path: string | null
          http_status: number | null
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          response_time: number | null
          timestamp: string
        }
        Insert: {
          endpoint_path?: string | null
          http_status?: number | null
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          response_time?: number | null
          timestamp?: string
        }
        Update: {
          endpoint_path?: string | null
          http_status?: number | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          response_time?: number | null
          timestamp?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          is_special: boolean | null
          required_points: number | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_special?: boolean | null
          required_points?: number | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_special?: boolean | null
          required_points?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "badges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      banned_usernames: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          reason: string | null
          word: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string | null
          word: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string | null
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "banned_usernames_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          recipe_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          recipe_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          recipe_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_reviews: {
        Row: {
          author: string
          brand: string
          category: string
          cons: Json | null
          content: string | null
          created_at: string
          created_by: string | null
          durability_rating: number | null
          ease_of_use_rating: number | null
          id: string
          image_url: string | null
          images: Json[] | null
          is_featured: boolean | null
          is_published: boolean | null
          model: string | null
          price_range: string | null
          pros: Json | null
          rating: number | null
          title: string
          value_rating: number | null
          video_provider: string | null
          video_url: string | null
        }
        Insert: {
          author: string
          brand: string
          category: string
          cons?: Json | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          durability_rating?: number | null
          ease_of_use_rating?: number | null
          id?: string
          image_url?: string | null
          images?: Json[] | null
          is_featured?: boolean | null
          is_published?: boolean | null
          model?: string | null
          price_range?: string | null
          pros?: Json | null
          rating?: number | null
          title: string
          value_rating?: number | null
          video_provider?: string | null
          video_url?: string | null
        }
        Update: {
          author?: string
          brand?: string
          category?: string
          cons?: Json | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          durability_rating?: number | null
          ease_of_use_rating?: number | null
          id?: string
          image_url?: string | null
          images?: Json[] | null
          is_featured?: boolean | null
          is_published?: boolean | null
          model?: string | null
          price_range?: string | null
          pros?: Json | null
          rating?: number | null
          title?: string
          value_rating?: number | null
          video_provider?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_reviews_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_reviews: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          is_featured: boolean | null
          review_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order: number
          id?: string
          is_featured?: boolean | null
          review_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          is_featured?: boolean | null
          review_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_reviews_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_reviews_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "equipment_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_edited: boolean | null
          is_removed: boolean | null
          is_reported: boolean | null
          is_solution: boolean | null
          likes_count: number | null
          thread_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_edited?: boolean | null
          is_removed?: boolean | null
          is_reported?: boolean | null
          is_solution?: boolean | null
          likes_count?: number | null
          thread_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_edited?: boolean | null
          is_removed?: boolean | null
          is_reported?: boolean | null
          is_solution?: boolean | null
          likes_count?: number | null
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_settings: {
        Row: {
          allow_guest_viewing: boolean | null
          auto_lock_inactive: boolean | null
          created_at: string
          id: number
          require_approval: boolean | null
          updated_at: string
        }
        Insert: {
          allow_guest_viewing?: boolean | null
          auto_lock_inactive?: boolean | null
          created_at?: string
          id?: number
          require_approval?: boolean | null
          updated_at?: string
        }
        Update: {
          allow_guest_viewing?: boolean | null
          auto_lock_inactive?: boolean | null
          created_at?: string
          id?: number
          require_approval?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      forum_threads: {
        Row: {
          category_id: string | null
          content: string
          created_at: string
          created_by: string | null
          forum_id: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_post_at: string
          last_post_by: string | null
          password: string | null
          password_protected: boolean | null
          post_count: number | null
          required_role: string | null
          slug: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          forum_id?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_post_at?: string
          last_post_by?: string | null
          password?: string | null
          password_protected?: boolean | null
          post_count?: number | null
          required_role?: string | null
          slug?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          forum_id?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_post_at?: string
          last_post_by?: string | null
          password?: string | null
          password_protected?: boolean | null
          post_count?: number | null
          required_role?: string | null
          slug?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_threads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_threads_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "forums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_threads_last_post_by_fkey"
            columns: ["last_post_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forums: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number | null
          id: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forums_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forums_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_groups: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          identifier: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          identifier: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          identifier?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_visible: boolean | null
          label: string
          menu_group_id: string | null
          parent_id: string | null
          path: string
          requires_admin: boolean | null
          requires_staff: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          label: string
          menu_group_id?: string | null
          parent_id?: string | null
          path: string
          requires_admin?: boolean | null
          requires_staff?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          label?: string
          menu_group_id?: string | null
          parent_id?: string | null
          path?: string
          requires_admin?: boolean | null
          requires_staff?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_menu_group_id_fkey"
            columns: ["menu_group_id"]
            isOneToOne: false
            referencedRelation: "menu_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation_menu: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number | null
          id: string
          is_visible: boolean | null
          menu_type: string
          page_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_visible?: boolean | null
          menu_type: string
          page_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_visible?: boolean | null
          menu_type?: string
          page_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_menu_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "navigation_menu_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_permissions: {
        Row: {
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string
          id: string
          page_id: string | null
          role: string
        }
        Insert: {
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string
          id?: string
          page_id?: string | null
          role: string
        }
        Update: {
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string
          id?: string
          page_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_permissions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          id: string
          is_protected: boolean | null
          layout: string | null
          password: string | null
          required_role: string | null
          slug: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_protected?: boolean | null
          layout?: string | null
          password?: string | null
          required_role?: string | null
          slug: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_protected?: boolean | null
          layout?: string | null
          password?: string | null
          required_role?: string | null
          slug?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pizza_types: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_hidden: boolean | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_hidden?: boolean | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_hidden?: boolean | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pizza_types_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      point_rules: {
        Row: {
          action_type: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          points: number
        }
        Insert: {
          action_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          points: number
        }
        Update: {
          action_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          points?: number
        }
        Relationships: [
          {
            foreignKeyName: "point_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_change_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          requested_email: string | null
          requested_username: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          requested_email?: string | null
          requested_username?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          requested_email?: string | null
          requested_username?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_change_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_change_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badge_color: string | null
          badge_count: number
          badge_title: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          is_admin: boolean | null
          is_staff: boolean | null
          is_suspended: boolean | null
          is_verified: boolean | null
          last_seen: string | null
          points: number
          recipes_shared: number
          requires_recipe_approval: boolean | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          badge_color?: string | null
          badge_count?: number
          badge_title?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean | null
          is_staff?: boolean | null
          is_suspended?: boolean | null
          is_verified?: boolean | null
          last_seen?: string | null
          points?: number
          recipes_shared?: number
          requires_recipe_approval?: boolean | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          badge_color?: string | null
          badge_count?: number
          badge_title?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean | null
          is_staff?: boolean | null
          is_suspended?: boolean | null
          is_verified?: boolean | null
          last_seen?: string | null
          points?: number
          recipes_shared?: number
          requires_recipe_approval?: boolean | null
          username?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          approval_status: string | null
          author: string
          category_id: string | null
          content: string | null
          cook_time: string | null
          created_at: string
          created_by: string | null
          difficulty: string | null
          edit_requires_approval: boolean | null
          id: string
          image_url: string | null
          images: Json | null
          ingredients: Json | null
          instructions: Json | null
          is_featured: boolean | null
          last_edited_at: string | null
          nutrition_info: Json | null
          prep_time: string | null
          servings: string | null
          status: string | null
          tips: Json | null
          title: string
          video_provider: string | null
          video_url: string | null
        }
        Insert: {
          approval_status?: string | null
          author?: string
          category_id?: string | null
          content?: string | null
          cook_time?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: string | null
          edit_requires_approval?: boolean | null
          id?: string
          image_url?: string | null
          images?: Json | null
          ingredients?: Json | null
          instructions?: Json | null
          is_featured?: boolean | null
          last_edited_at?: string | null
          nutrition_info?: Json | null
          prep_time?: string | null
          servings?: string | null
          status?: string | null
          tips?: Json | null
          title: string
          video_provider?: string | null
          video_url?: string | null
        }
        Update: {
          approval_status?: string | null
          author?: string
          category_id?: string | null
          content?: string | null
          cook_time?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: string | null
          edit_requires_approval?: boolean | null
          id?: string
          image_url?: string | null
          images?: Json | null
          ingredients?: Json | null
          instructions?: Json | null
          is_featured?: boolean | null
          last_edited_at?: string | null
          nutrition_info?: Json | null
          prep_time?: string | null
          servings?: string | null
          status?: string | null
          tips?: Json | null
          title?: string
          video_provider?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          id: string
          rating: number | null
          recipe_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          rating?: number | null
          recipe_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          rating?: number | null
          recipe_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_settings: {
        Row: {
          admin_colors: Json | null
          admin_logo_url: string | null
          admin_menu: Json | null
          animations: Json | null
          colors: Json | null
          created_at: string
          created_by: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          is_admin_theme: boolean | null
          layout: Json | null
          menu_style: Json | null
          name: string
          site_logo_url: string | null
          spacing: Json | null
          typography: Json | null
          updated_at: string
        }
        Insert: {
          admin_colors?: Json | null
          admin_logo_url?: string | null
          admin_menu?: Json | null
          animations?: Json | null
          colors?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_admin_theme?: boolean | null
          layout?: Json | null
          menu_style?: Json | null
          name: string
          site_logo_url?: string | null
          spacing?: Json | null
          typography?: Json | null
          updated_at?: string
        }
        Update: {
          admin_colors?: Json | null
          admin_logo_url?: string | null
          admin_menu?: Json | null
          animations?: Json | null
          colors?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          is_admin_theme?: boolean | null
          layout?: Json | null
          menu_style?: Json | null
          name?: string
          site_logo_url?: string | null
          spacing?: Json | null
          typography?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "theme_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_points: {
        Args: {
          user_id: string
          action_type: string
        }
        Returns: undefined
      }
      check_user_recipe_approval: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      get_auth_config: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      is_username_allowed: {
        Args: {
          username: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
