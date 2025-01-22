import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PizzaStyleHeaderProps {
  title: string;
  description: string;
  onSubmitRecipe: () => void;
}

export const PizzaStyleHeader = ({ title, description, onSubmitRecipe }: PizzaStyleHeaderProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
  <div className="text-center">
    <h1 className="text-4xl font-bold text-textLight mb-4">{title}</h1>
    <p className="text-xl text-textLight mb-6">{description}</p>
    <Button 
      onClick={onSubmitRecipe}
      className="bg-accent hover:bg-accent-hover text-white"
    >
      <Plus className="w-4 h-4 mr-2" />
      Submit Recipe
    </Button>
  </div>
</div>
  );
};
