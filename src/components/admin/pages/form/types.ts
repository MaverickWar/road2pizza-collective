import { z } from "zod";

export const pageFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string(),
  is_protected: z.boolean().default(false),
  required_role: z.string().default("member"),
  password: z.string().optional(),
});

export type PageFormValues = z.infer<typeof pageFormSchema>;

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  is_protected: boolean;
  required_role: string;
  password: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}