import { Recipe } from "@/components/recipe/types";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/Rating";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthorCard from "../AuthorCard";
import MediaGallery from "../MediaGallery";
import RecipeContent from "./RecipeContent";
import RecipeIngredients from "./RecipeIngredients";
import RecipeInstructions from "./RecipeInstructions";
import RecipeTips from "./RecipeTips";
import ReviewSection from "../ReviewSection";
import NutritionInfo from "../NutritionInfo";

interface RecipeDetailLayoutProps {
  recipe: Recipe;
  canEdit: boolean;
  onEdit: () => void;
  onHide: () => void;
}

const RecipeDetailLayout = ({ recipe, canEdit, onEdit, onHide }: RecipeDetailLayoutProps) => {
  const navigate = useNavigate();
  const averageRating = recipe.reviews?.length 
    ? recipe.reviews.reduce((acc, review) => acc + review.rating, 0) / recipe.reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section with Edit/Hide Buttons */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          
          {canEdit && (
            <div className="space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Recipe
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={onHide}
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Recipe
              </Button>
            </div>
          )}
        </div>

        {recipe.status === 'unpublished' && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
            This recipe is unpublished. Only you and administrators can view it.
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">{recipe.title}</h1>
              
              <div className="flex items-center space-x-4">
                {averageRating > 0 && <Rating value={averageRating} />}
                <span className="text-sm text-muted-foreground">
                  {format(new Date(recipe.created_at), 'MMMM dd, yyyy')}
                </span>
              </div>
            </div>

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

          <div className="space-y-6">
            {/* Author Card Section */}
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
      </div>
    </div>
  );
};

export default RecipeDetailLayout;