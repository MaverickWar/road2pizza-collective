import { Card } from "@/components/ui/card";
import type { Recipe } from "@/components/recipe/types";
import AuthorCard from "../AuthorCard";
import RecipeIngredients from "./RecipeIngredients";
import RecipeInstructions from "./RecipeInstructions";
import RecipeTips from "./RecipeTips";

interface RecipeSidebarProps {
  recipe: Recipe;
}

const RecipeSidebar = ({ recipe }: RecipeSidebarProps) => {
  return (
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
  );
};

export default RecipeSidebar;