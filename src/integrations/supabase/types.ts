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
          is_featured: boolean | null
          model: string | null
          price_range: string | null
          pros: Json | null
          rating: number | null
          title: string
          value_rating: number | null
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
          is_featured?: boolean | null
          model?: string | null
          price_range?: string | null
          pros?: Json | null
          rating?: number | null
          title: string
          value_rating?: number | null
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
          is_featured?: boolean | null
          model?: string | null
          price_range?: string | null
          pros?: Json | null
          rating?: number | null
          title?: string
          value_rating?: number | null
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
      forum_threads: {
        Row: {
          category_id: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_post_at: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_post_at?: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_post_at?: string
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
          badge_color: string | null
          badge_count: number
          badge_title: string | null
          created_at: string
          id: string
          is_admin: boolean | null
          is_staff: boolean | null
          is_suspended: boolean | null
          points: number
          recipes_shared: number
          username: string
        }
        Insert: {
          badge_color?: string | null
          badge_count?: number
          badge_title?: string | null
          created_at?: string
          id: string
          is_admin?: boolean | null
          is_staff?: boolean | null
          is_suspended?: boolean | null
          points?: number
          recipes_shared?: number
          username: string
        }
        Update: {
          badge_color?: string | null
          badge_count?: number
          badge_title?: string | null
          created_at?: string
          id?: string
          is_admin?: boolean | null
          is_staff?: boolean | null
          is_suspended?: boolean | null
          points?: number
          recipes_shared?: number
          username?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          author: string
          category_id: string | null
          content: string | null
          cook_time: string | null
          created_at: string
          created_by: string | null
          difficulty: string | null
          id: string
          image_url: string | null
          ingredients: Json | null
          instructions: Json | null
          is_featured: boolean | null
          nutrition_info: Json | null
          prep_time: string | null
          servings: string | null
          tips: Json | null
          title: string
        }
        Insert: {
          author: string
          category_id?: string | null
          content?: string | null
          cook_time?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: Json | null
          is_featured?: boolean | null
          nutrition_info?: Json | null
          prep_time?: string | null
          servings?: string | null
          tips?: Json | null
          title: string
        }
        Update: {
          author?: string
          category_id?: string | null
          content?: string | null
          cook_time?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: Json | null
          is_featured?: boolean | null
          nutrition_info?: Json | null
          prep_time?: string | null
          servings?: string | null
          tips?: Json | null
          title?: string
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
