export interface Review {
  rating: number;
  content: string;
  user_id: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

export interface Recipe {
  id: string;
  title: string;
  author: string;
  category_id: string | null;
  image_url: string | null;
  content: string | null;
  created_at: string;
  created_by: string | null;
  is_featured?: boolean;
  status: 'published' | 'unpublished' | 'rejected';
  reviews: Review[];
  categories?: {
    name: string;
  } | null;
  prep_time?: string;
  cook_time?: string;
  servings?: string;
  difficulty?: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  profiles: {
    username: string;
  };
  nutrition_info?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  } | null;
  approval_status: 'pending' | 'approved' | 'rejected';
  edit_requires_approval: boolean;
  last_edited_at?: string | null;
}