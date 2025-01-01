import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Editor from "@/components/Editor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

interface RecipeSubmissionFormProps {
  pizzaTypeId?: string;
  onSubmit?: () => void;
}

const RecipeSubmissionForm = ({ pizzaTypeId, onSubmit }: RecipeSubmissionFormProps) => {
  const { user, isStaff, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const form = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      categoryId: pizzaTypeId || "",
      difficulty: "",
      prepTime: "",
      cookTime: "",
      servings: "",
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof recipeSchema>) => {
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
        status: isAdmin || isStaff ? 'published' : 'unpublished',
        image_url: imageUrl,
      };

      const { data: recipe, error } = await supabase
        .from("recipes")
        .insert(recipeData)
        .select()
        .single();

      if (error) throw error;

      if (isAdmin || isStaff) {
        toast.success("Recipe published successfully!");
      } else {
        toast.success("Recipe submitted successfully! It will be reviewed by our team.");
      }
      
      if (onSubmit) onSubmit();
      navigate(`/article/${recipe.id}`);
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast.error("Failed to submit recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            Back
          </Button>
          <h2 className="text-2xl font-bold">Submit Recipe</h2>
        </div>

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

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Recipe"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecipeSubmissionForm;
