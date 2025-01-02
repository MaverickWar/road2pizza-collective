import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ImageUpload from "./form/ImageUpload";
import DifficultySelect from "./form/DifficultySelect";
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

  const handleVideoUrlChange = (url: string) => {
    let provider = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      provider = 'youtube';
    } else if (url.includes('vimeo.com')) {
      provider = 'vimeo';
    }
    setFormData((prev) => ({ 
      ...prev, 
      video_url: url,
      video_provider: provider 
    }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image_url: imageUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Recipe Title</Label>
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
          <Label htmlFor="image">Recipe Image</Label>
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            currentImageUrl={formData.image_url}
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="video_url">Video URL (YouTube or Vimeo)</Label>
          <Input
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            placeholder="e.g., https://youtube.com/watch?v=..."
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Supports YouTube and Vimeo URLs
          </p>
        </div>

        <div>
          <Label htmlFor="content">Description</Label>
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
          <Label htmlFor="difficulty">Difficulty</Label>
          <DifficultySelect
            value={formData.difficulty}
            onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="prep_time">Prep Time</Label>
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
          <Label htmlFor="cook_time">Cook Time</Label>
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
          <Label htmlFor="servings">Servings</Label>
          <Input
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            placeholder="e.g., 4"
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