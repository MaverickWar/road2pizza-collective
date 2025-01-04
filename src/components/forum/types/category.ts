export interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
}