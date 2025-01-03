import { Card } from "@/components/ui/card";

interface RecipeIngredientsProps {
  ingredients: string[];
}

const RecipeIngredients = ({ ingredients }: RecipeIngredientsProps) => {
  if (!ingredients?.length) return null;

  return (
    <Card className="p-6 bg-card hover:bg-card-hover transition-colors">
      <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-start">
            <span className="text-accent mr-2">•</span>
            <span>{ingredient}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default RecipeIngredients;