
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ListEditor from "@/components/article/edit/ListEditor";
import FormFields from "./form/FormFields";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface RecipeSubmissionFormProps {
  pizzaTypeId?: string;
  onSuccess?: () => void;
}

const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Description is required"),
  image_url: z.string().min(1, "Image is required"),
  video_url: z.string().optional(),
  video_provider: z.string().optional(),
  prep_time: z.string().optional(),
  cook_time: z.string().optional(),
  servings: z.string().optional(),
  difficulty: z.string().optional(),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

const RecipeSubmissionForm = ({ pizzaTypeId, onSuccess }: RecipeSubmissionFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      content: "",
      image_url: "",
      video_url: "",
      video_provider: "",
      prep_time: "",
      cook_time: "",
      servings: "",
      difficulty: "",
    },
  });

  const handleSubmit = async (data: RecipeFormValues) => {
    if (!user) {
      toast.error("Please login to submit a recipe");
      return;
    }

    if (ingredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }

    if (instructions.length === 0) {
      toast.error("Please add at least one instruction");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting recipe submission...");

      // Submit recipe with optimistic update
      const { data: recipe, error } = await supabase
        .from("recipes")
        .insert([{
          ...data,
          ingredients,
          instructions,
          tips,
          category_id: pizzaTypeId,
          created_by: user.id,
          author: user.email,
          status: 'pending',
        }])
        .select()
        .single();

      if (error) throw error;

      console.log("Recipe submitted successfully:", recipe);
      toast.success("Recipe submitted successfully! It will be reviewed by our team.");
      onSuccess?.();
      
      navigate("/dashboard", { 
        state: { 
          showRecipeForm: false,
          recipeSubmitted: true 
        } 
      });
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast.error("Failed to submit recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FormFields
        form={form}
        disabled={loading}
      />

      <ListEditor
        title="Ingredients"
        items={ingredients}
        onChange={setIngredients}
        placeholder="Add ingredient"
        disabled={loading}
      />

      <ListEditor
        title="Instructions"
        items={instructions}
        onChange={setInstructions}
        placeholder="Add instruction"
        disabled={loading}
      />

      <ListEditor
        title="Pro Tips"
        items={tips}
        onChange={setTips}
        placeholder="Add tip"
        disabled={loading}
      />

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-highlight hover:bg-highlight-hover text-highlight-foreground font-semibold text-lg py-6"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting Recipe...
          </>
        ) : (
          "Submit Recipe"
        )}
      </Button>
    </form>
  );
};

export default RecipeSubmissionForm;
