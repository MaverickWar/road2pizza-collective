import { z } from "zod";

export const reviewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price_range: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  rating: z.number().min(1).max(5),
  durability_rating: z.number().min(1).max(5),
  value_rating: z.number().min(1).max(5),
  ease_of_use_rating: z.number().min(1).max(5),
  is_featured: z.boolean().default(false),
  imageUrl: z.string().optional(),
  additionalImages: z.array(z.string()).default([]),
  videoUrl: z.string().optional(),
  videoProvider: z.string().optional(),
  pros: z.array(z.string()).default([""]),
  cons: z.array(z.string()).default([""]),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export interface ReviewData {
  id: string;
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
  is_featured: boolean;
  image_url?: string;
  images?: string[];
  video_url?: string;
  video_provider?: string;
  pros?: string[];
  cons?: string[];
  created_at: string;
  created_by?: string;
  profiles?: {
    username: string;
  };
}