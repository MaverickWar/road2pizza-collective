import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ImageUpload from "./form/ImageUpload";
import { useNavigate } from "react-router-dom";

interface RecipeSubmissionFormProps {
  pizzaTypeId?: string;
  onSuccess?: () => void;
}

const RecipeSubmissionForm = ({ pizzaTypeId, onSuccess }: RecipeSubmissionFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    ingredients: [] as string[],
    instructions: [] as string[],
    tips: [] as string[],
    prep_time: "",
    cook_time: "",
    servings: "",
    difficulty: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a recipe");
      return;
    }

    try {
      setLoading(true);
      console.log("Submitting recipe:", formData);

      const { data, error } = await supabase.from("recipes").insert([
        {
          ...formData,
          category_id: pizzaTypeId,
          created_by: user.id,
          author: user.email,
        },
      ]).select();

      if (error) throw error;

      toast.success("Recipe submitted successfully! It will be reviewed by our team.");
      onSuccess?.();
      
      // Redirect to dashboard
      navigate("/dashboard", { 
        state: { 
          showRecipeForm: false,
          recipeSubmitted: true 
        } 
      });
      
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast.error("Failed to submit recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image_url: imageUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Recipe Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Recipe Image
          </label>
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            currentImageUrl={formData.image_url}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="prep_time" className="block text-sm font-medium mb-1">
            Prep Time
          </label>
          <Input
            id="prep_time"
            name="prep_time"
            value={formData.prep_time}
            onChange={handleChange}
            placeholder="e.g., 30 minutes"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="cook_time" className="block text-sm font-medium mb-1">
            Cook Time
          </label>
          <Input
            id="cook_time"
            name="cook_time"
            value={formData.cook_time}
            onChange={handleChange}
            placeholder="e.g., 15 minutes"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="servings" className="block text-sm font-medium mb-1">
            Servings
          </label>
          <Input
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            placeholder="e.g., 4"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
            Difficulty
          </label>
          <Input
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            placeholder="e.g., Easy, Medium, Hard"
            disabled={loading}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Recipe"}
      </Button>
    </form>
  );
};

export default RecipeSubmissionForm;