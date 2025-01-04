import { Rating } from "@/components/Rating";
import { format } from "date-fns";
import type { Recipe } from "@/components/recipe/types";

interface RecipeMetadataProps {
  recipe: Recipe;
  averageRating: number;
}

const RecipeMetadata = ({ recipe, averageRating }: RecipeMetadataProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold text-foreground">{recipe.title}</h1>
      <div className="flex items-center space-x-4">
        {averageRating > 0 && <Rating value={averageRating} />}
        <span className="text-sm text-muted-foreground">
          {format(new Date(recipe.created_at), 'MMMM dd, yyyy')}
        </span>
      </div>
    </div>
  );
};

export default RecipeMetadata;