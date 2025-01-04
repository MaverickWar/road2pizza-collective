import type { Recipe } from "@/components/recipe/types";
import RecipeHeader from "../RecipeHeader";
import RecipeVisibilityBanner from "./RecipeVisibilityBanner";
import RecipeMetadata from "./RecipeMetadata";
import RecipeMainContent from "./RecipeMainContent";
import RecipeSidebar from "./RecipeSidebar";

interface RecipeDetailLayoutProps {
  recipe: Recipe;
  canEdit: boolean;
  onEdit: () => void;
  onHide: () => void;
}

const RecipeDetailLayout = ({ recipe, canEdit, onEdit, onHide }: RecipeDetailLayoutProps) => {
  const isHidden = recipe.status === 'unpublished';
  const averageRating = recipe.reviews?.length 
    ? recipe.reviews.reduce((acc, review) => acc + review.rating, 0) / recipe.reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <RecipeHeader
          canEdit={canEdit}
          isHidden={isHidden}
          onBack={() => window.history.back()}
          onEdit={onEdit}
          onHide={onHide}
        />

        {isHidden && <RecipeVisibilityBanner />}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <RecipeMetadata recipe={recipe} averageRating={averageRating} />
            <RecipeMainContent recipe={recipe} />
          </div>

          <RecipeSidebar recipe={recipe} />
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailLayout;