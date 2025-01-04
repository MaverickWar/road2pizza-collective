import { Card } from "@/components/ui/card";
import type { Recipe } from "@/components/recipe/types";
import MediaGallery from "../MediaGallery";
import AuthorCard from "../AuthorCard";
import NutritionInfo from "../NutritionInfo";
import ReviewSection from "../ReviewSection";
import RecipeContent from "./RecipeContent";

interface RecipeMainContentProps {
  recipe: Recipe;
}

const RecipeMainContent = ({ recipe }: RecipeMainContentProps) => {
  console.log('Rendering RecipeMainContent with recipe:', recipe);
  console.log('Author info:', recipe.profiles);

  return (
    <div className="space-y-6">
      <AuthorCard author={recipe.profiles} />
      
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
      
      {recipe.reviews && recipe.reviews.length > 0 && (
        <ReviewSection reviews={recipe.reviews} />
      )}
    </div>
  );
};

export default RecipeMainContent;