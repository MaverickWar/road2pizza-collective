import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

export const reviewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price_range: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  rating: z.string().transform((val) => parseInt(val, 10)),
  durability_rating: z.string().transform((val) => parseInt(val, 10)),
  value_rating: z.string().transform((val) => parseInt(val, 10)),
  ease_of_use_rating: z.string().transform((val) => parseInt(val, 10)),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export interface ReviewData extends ReviewFormData {
  author: string;
  cons?: Json;
  pros?: Json;
  created_by?: string;
  image_url?: string;
  is_featured?: boolean;
}