import { Recipe } from "@/components/recipe/types";

interface RecipeDetailsProps {
  recipe: Recipe;
}

const RecipeDetails = ({ recipe }: RecipeDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
        <p><strong>Prep Time:</strong> {recipe.prep_time}</p>
        <p><strong>Cook Time:</strong> {recipe.cook_time}</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
        <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
      </div>

      {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
        <div className="bg-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
          <ul className="list-disc list-inside space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
        <div className="bg-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Instructions</h3>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      )}

      {Array.isArray(recipe.tips) && recipe.tips.length > 0 && (
        <div className="bg-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
          <ul className="list-disc list-inside space-y-2">
            {recipe.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;