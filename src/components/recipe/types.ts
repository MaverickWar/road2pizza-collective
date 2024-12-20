export interface Review {
  rating: number;
  content: string;
  user_id: string;
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
  content: string;
  created_at: string;
  created_by: string | null;
  is_featured?: boolean;
  reviews: Review[];
  categories?: {
    name: string;
  } | null;
  prep_time?: string;
  cook_time?: string;
  servings?: string;
  difficulty?: string;
}