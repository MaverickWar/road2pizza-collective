import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PizzaStyleHeaderProps {
  title: string;
  description: string;
  onSubmitRecipe: () => void;
}

export const PizzaStyleHeader = ({ title, description, onSubmitRecipe }: PizzaStyleHeaderProps) => {
  return (
 
      <Button 
        onClick={onSubmitRecipe}
        className="bg-accent hover:bg-accent-hover text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Submit Recipe
      </Button>
    </div>
  );
};
