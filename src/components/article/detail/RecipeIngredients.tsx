import { Card } from "@/components/ui/card";

interface RecipeIngredientsProps {
  ingredients: string[];
}

const RecipeIngredients = ({ ingredients }: RecipeIngredientsProps) => {
  if (!ingredients?.length) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
      <ul className="list-disc list-inside space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="text-gray-600">{ingredient}</li>
        ))}
      </ul>
    </Card>
  );
};

export default RecipeIngredients;