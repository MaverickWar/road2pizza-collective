import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "@/components/Editor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUpload from "./form/ImageUpload";

const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  prepTime: z.string().min(1, "Prep time is required"),
  cookTime: z.string().min(1, "Cook time is required"),
  servings: z.string().min(1, "Servings is required"),
  content: z.string().min(1, "Recipe content is required"),
});

interface RecipeFormProps {
  onCancel: () => void;
  existingRecipe?: any;
}

const RecipeForm = ({ onCancel, existingRecipe }: RecipeFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(existingRecipe?.image_url || "");

  const form = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: existingRecipe?.title || "",
      categoryId: existingRecipe?.category_id || "",
      difficulty: existingRecipe?.difficulty || "",
      prepTime: existingRecipe?.prep_time || "",
      cookTime: existingRecipe?.cook_time || "",
      servings: existingRecipe?.servings || "",
      content: existingRecipe?.content || "",
    },
  });

  // Fetch categories for the select dropdown
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("Fetching categories...");
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      console.log("Fetched categories:", data);
      return data;
    },
  });

  const onSubmit = async (values: z.infer<typeof recipeSchema>) => {
    if (!user) return;

    setLoading(true);
    try {
      const recipeData = {
        title: values.title,
        content: values.content,
        author: user.email,
        created_by: user.id,
        category_id: values.categoryId,
        prep_time: values.prepTime,
        cook_time: values.cookTime,
        servings: values.servings,
        difficulty: values.difficulty,
        image_url: imageUrl,
      };

      let error;
      if (existingRecipe) {
        ({ error } = await supabase
          .from("recipes")
          .update(recipeData)
          .eq("id", existingRecipe.id));
      } else {
        ({ error } = await supabase.from("recipes").insert(recipeData));
      }

      if (error) throw error;

      toast.success(existingRecipe ? "Recipe updated successfully!" : "Recipe created successfully!");
      navigate("/dashboard/staff");
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error("Failed to save recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter recipe title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Recipe Image</FormLabel>
            <ImageUpload 
              onImageUrlChange={setImageUrl} 
              existingImageUrl={imageUrl}
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="prepTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prep Time</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 30 mins" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cookTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cook Time</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1 hour" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servings</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 4-6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe Content</FormLabel>
                <FormControl>
                  <Editor content={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? "Saving..." : existingRecipe ? "Update Recipe" : "Create Recipe"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecipeForm;
