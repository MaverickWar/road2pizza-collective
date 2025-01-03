import { Card } from "@/components/ui/card";

interface RecipeInstructionsProps {
  instructions: string[];
}

const RecipeInstructions = ({ instructions }: RecipeInstructionsProps) => {
  if (!instructions?.length) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Instructions</h3>
      <ol className="list-decimal list-inside space-y-2">
        {instructions.map((instruction, index) => (
          <li key={index} className="text-gray-600">{instruction}</li>
        ))}
      </ol>
    </Card>
  );
};

export default RecipeInstructions;