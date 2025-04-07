
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Editor from "@/components/Editor";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ListEditor from "./ListEditor";
import ImageUpload from "@/components/recipe/form/ImageUpload";

interface EditRecipeFormProps {
  recipe: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const EditRecipeForm = ({ recipe, onSave, onCancel, isLoading }: EditRecipeFormProps) => {
  const [content, setContent] = useState(recipe.content || "");
  const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients || []);
  const [instructions, setInstructions] = useState<string[]>(recipe.instructions || []);
  const [tips, setTips] = useState<string[]>(recipe.tips || []);
  const [title, setTitle] = useState(recipe.title || "");
  const [prepTime, setPrepTime] = useState(recipe.prep_time || "");
  const [cookTime, setCookTime] = useState(recipe.cook_time || "");
  const [servings, setServings] = useState(recipe.servings || "");
  const [difficulty, setDifficulty] = useState(recipe.difficulty || "");
  const [categoryId, setCategoryId] = useState(recipe.category_id || "");
  const [imageUrl, setImageUrl] = useState(recipe.image_url || "");
  const [videoUrl, setVideoUrl] = useState(recipe.video_url || "");
  const [videoProvider, setVideoProvider] = useState(recipe.video_provider || "");
  const [ingredientsError, setIngredientsError] = useState<string | null>(null);
  const [instructionsError, setInstructionsError] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setVideoProvider('youtube');
    } else if (url.includes('vimeo.com')) {
      setVideoProvider('vimeo');
    } else {
      setVideoProvider('');
    }
  };

  const handleSubmit = async () => {
    // Validate ingredients and instructions
    let hasError = false;
    if (ingredients.length === 0) {
      setIngredientsError("Please add at least one ingredient");
      hasError = true;
    } else {
      setIngredientsError(null);
    }

    if (instructions.length === 0) {
      setInstructionsError("Please add at least one instruction");
      hasError = true;
    } else {
      setInstructionsError(null);
    }

    if (hasError) {
      return;
    }

    await onSave({
      title,
      content,
      ingredients,
      instructions,
      tips,
      prep_time: prepTime,
      cook_time: cookTime,
      servings,
      difficulty,
      category_id: categoryId,
      image_url: imageUrl,
      video_url: videoUrl,
      video_provider: videoProvider
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <Label>Image</Label>
        <ImageUpload
          onImageUploaded={setImageUrl}
          currentImageUrl={imageUrl}
          disabled={isLoading}
        />
      </div>

      <div>
        <Label>Video URL (YouTube or Vimeo)</Label>
        <Input
          value={videoUrl}
          onChange={(e) => handleVideoUrlChange(e.target.value)}
          placeholder="e.g., https://youtube.com/watch?v=..."
          disabled={isLoading}
        />
      </div>

      <div>
        <Label>Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Difficulty</Label>
        <Select value={difficulty} onValueChange={setDifficulty} disabled={isLoading}>
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Prep Time</Label>
          <Input
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            placeholder="e.g., 30 minutes"
            disabled={isLoading}
          />
        </div>
        <div>
          <Label>Cook Time</Label>
          <Input
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            placeholder="e.g., 1 hour"
            disabled={isLoading}
          />
        </div>
        <div>
          <Label>Servings</Label>
          <Input
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="e.g., 4-6 servings"
            disabled={isLoading}
          />
        </div>
      </div>

      <ListEditor
        title="Ingredients"
        items={ingredients}
        onChange={setIngredients}
        placeholder="Add ingredient"
        disabled={isLoading}
        error={ingredientsError || undefined}
      />

      <ListEditor
        title="Instructions"
        items={instructions}
        onChange={setInstructions}
        placeholder="Add instruction"
        disabled={isLoading}
        error={instructionsError || undefined}
      />

      <ListEditor
        title="Pro Tips"
        items={tips}
        onChange={setTips}
        placeholder="Add tip"
        disabled={isLoading}
      />

      <div>
        <Label>Recipe Content</Label>
        <Editor content={content} onChange={setContent} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default EditRecipeForm;
