import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ListEditor from "@/components/article/edit/ListEditor";
import FormFields from "./form/FormFields";
import { Loader2 } from "lucide-react";

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
    video_url: "",
    video_provider: "",
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
      console.log("Submitting recipe with data:", formData);

      // Submit recipe with optimistic update
      const { data, error } = await supabase
        .from("recipes")
        .insert([{
          ...formData,
          category_id: pizzaTypeId,
          created_by: user.id,
          author: user.email,
          status: 'pending',
        }])
        .select()
        .single();

      if (error) throw error;

      console.log("Recipe submitted successfully:", data);
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

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoUrlChange = (url: string) => {
    let provider = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      provider = 'youtube';
    } else if (url.includes('vimeo.com')) {
      provider = 'vimeo';
    }
    setFormData(prev => ({ 
      ...prev, 
      video_url: url,
      video_provider: provider 
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormFields
        formData={formData}
        onChange={handleFieldChange}
        onImageUploaded={(url) => handleFieldChange('image_url', url)}
        onVideoUrlChange={handleVideoUrlChange}
        disabled={loading}
      />

      <ListEditor
        title="Ingredients"
        items={formData.ingredients}
        onChange={(items) => setFormData(prev => ({ ...prev, ingredients: items }))}
        placeholder="Add ingredient"
        disabled={loading}
      />

      <ListEditor
        title="Instructions"
        items={formData.instructions}
        onChange={(items) => setFormData(prev => ({ ...prev, instructions: items }))}
        placeholder="Add instruction"
        disabled={loading}
      />

      <ListEditor
        title="Pro Tips"
        items={formData.tips}
        onChange={(items) => setFormData(prev => ({ ...prev, tips: items }))}
        placeholder="Add tip"
        disabled={loading}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Recipe"
        )}
      </Button>
    </form>
  );
};

export default RecipeSubmissionForm;