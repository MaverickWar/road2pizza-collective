import { Card } from "@/components/ui/card";

interface RecipeInstructionsProps {
  instructions: string[];
}

const RecipeInstructions = ({ instructions }: RecipeInstructionsProps) => {
  if (!instructions?.length) return null;

  return (
    <Card className="p-6 bg-card hover:bg-card-hover transition-colors">
      <h3 className="text-lg font-semibold mb-4">Instructions</h3>
      <ol className="space-y-4">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex space-x-4">
            <span className="text-accent font-bold min-w-[1.5rem]">{index + 1}.</span>
            <span>{instruction}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
};

export default RecipeInstructions;