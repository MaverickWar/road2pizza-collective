import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Recipe } from "@/components/recipe/types";

interface RecipeHeaderProps {
  recipe: Recipe;
  canEdit: boolean;
  onBack: () => void;
  onEdit: () => void;
  onHide: () => void;
}

const RecipeHeader = ({ recipe, canEdit, onBack, onEdit, onHide }: RecipeHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="mr-2" />
        Back
      </Button>
      
      {canEdit && (
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={onEdit}
          >
            Edit Recipe
          </Button>
          <Button 
            variant="destructive"
            onClick={onHide}
          >
            Hide Recipe
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeHeader;