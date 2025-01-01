import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Recipe } from "./types";
import ImageUpload from "./form/ImageUpload";

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

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image_url: imageUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Recipe Image
          </label>
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            currentImageUrl={formData.image_url}
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
            Difficulty
          </label>
          <Select
            value={formData.difficulty || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, difficulty: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="prep_time" className="block text-sm font-medium mb-1">
            Prep Time
          </label>
          <Input
            id="prep_time"
            name="prep_time"
            value={formData.prep_time || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="cook_time" className="block text-sm font-medium mb-1">
            Cook Time
          </label>
          <Input
            id="cook_time"
            name="cook_time"
            value={formData.cook_time || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="servings" className="block text-sm font-medium mb-1">
            Servings
          </label>
          <Input
            id="servings"
            name="servings"
            value={formData.servings || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Description
          </label>
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