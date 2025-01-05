import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

// Schema matches required fields from Supabase table
export const reviewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price_range: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  rating: z.coerce.number().min(1).max(5),
  durability_rating: z.coerce.number().min(1).max(5),
  value_rating: z.coerce.number().min(1).max(5),
  ease_of_use_rating: z.coerce.number().min(1).max(5),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export type ReviewData = {
  id?: string;
  title: string;
  author: string;
  brand: string;
  model?: string;
  category: string;
  price_range?: string;
  content: string;
  rating: number;
  durability_rating: number;
  value_rating: number;
  ease_of_use_rating: number;
  created_by?: string;
  created_at: string;
  image_url?: string;
  is_featured?: boolean;
  cons?: string[];
  pros?: string[];
};