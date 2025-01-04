import { Card } from "@/components/ui/card";
import type { Recipe } from "@/components/recipe/types";
import MediaGallery from "../MediaGallery";
import RecipeContent from "./RecipeContent";
import NutritionInfo from "../NutritionInfo";
import ReviewSection from "../ReviewSection";

interface RecipeMainContentProps {
  recipe: Recipe;
}

const RecipeMainContent = ({ recipe }: RecipeMainContentProps) => {
  return (
    <div className="space-y-6">
      <MediaGallery 
        imageUrl={recipe.image_url}
        videoUrl={recipe.video_url}
        videoProvider={recipe.video_provider}
        images={Array.isArray(recipe.images) ? recipe.images : []}
      />
      
      <Card className="p-6">
        <RecipeContent recipe={recipe} />
      </Card>

      {recipe.nutrition_info && (
        <NutritionInfo nutritionInfo={recipe.nutrition_info} />
      )}
      
      <ReviewSection reviews={recipe.reviews} />
    </div>
  );
};

export default RecipeMainContent;