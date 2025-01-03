import { Recipe } from "@/components/recipe/types";
import { Card } from "@/components/ui/card";
import AuthorCard from "../AuthorCard";
import MediaGallery from "../MediaGallery";
import RecipeContent from "../RecipeContent";
import ReviewSection from "../ReviewSection";

interface RecipeDetailLayoutProps {
  recipe: Recipe;
}

const RecipeDetailLayout = ({ recipe }: RecipeDetailLayoutProps) => {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <MediaGallery 
          imageUrl={recipe.image_url}
          videoUrl={recipe.video_url}
          videoProvider={recipe.video_provider}
          images={Array.isArray(recipe.images) ? recipe.images : []}
        />
        
        <RecipeContent recipe={recipe} />
        
        <ReviewSection reviews={recipe.reviews} />
      </div>

      <div className="space-y-6">
        <AuthorCard author={recipe.profiles} />
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
          <div className="space-y-2">
            <p><strong>Prep Time:</strong> {recipe.prep_time}</p>
            <p><strong>Cook Time:</strong> {recipe.cook_time}</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>
            <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
          </div>
        </Card>

        <RecipeIngredients ingredients={recipe.ingredients} />
        <RecipeInstructions instructions={recipe.instructions} />
        <RecipeTips tips={recipe.tips} />
      </div>
    </div>
  );
};

export default RecipeDetailLayout;