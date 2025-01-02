import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Recipe } from "./types";
import ImageUpload from "./form/ImageUpload";
import DifficultySelect from "./form/DifficultySelect";

interface RecipeFormProps {
  onSubmit: (recipe: Partial<Recipe>) => void;
  initialData?: Partial<Recipe>;
  buttonText?: string;
}

const RecipeForm = ({ onSubmit, initialData, buttonText = "Submit" }: RecipeFormProps) => {
  const [formData, setFormData] = useState<Partial<Recipe>>(initialData || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Recipe Image</Label>
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            currentImageUrl={formData.image_url}
          />
        </div>

        <div>
          <Label htmlFor="video_url">Video URL (YouTube or Vimeo)</Label>
          <Input
            id="video_url"
            name="video_url"
            value={formData.video_url || ""}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            placeholder="e.g., https://youtube.com/watch?v=..."
          />
          <p className="text-sm text-gray-500 mt-1">
            Supports YouTube and Vimeo URLs
          </p>
        </div>

        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <DifficultySelect
            value={formData.difficulty || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, difficulty: value }))
            }
          />
        </div>

        <div>
          <Label htmlFor="prep_time">Prep Time</Label>
          <Input
            id="prep_time"
            name="prep_time"
            value={formData.prep_time || ""}
            onChange={handleChange}
            placeholder="e.g., 30 minutes"
          />
        </div>

        <div>
          <Label htmlFor="cook_time">Cook Time</Label>
          <Input
            id="cook_time"
            name="cook_time"
            value={formData.cook_time || ""}
            onChange={handleChange}
            placeholder="e.g., 15 minutes"
          />
        </div>

        <div>
          <Label htmlFor="servings">Servings</Label>
          <Input
            id="servings"
            name="servings"
            value={formData.servings || ""}
            onChange={handleChange}
            placeholder="e.g., 4"
          />
        </div>

        <div>
          <Label htmlFor="content">Description</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content || ""}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        {buttonText}
      </Button>
    </form>
  );
};

export default RecipeForm;