import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, EyeOff } from "lucide-react";
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={onEdit}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline"
            onClick={onHide}
          >
            <EyeOff className="w-4 h-4 mr-2" />
            Hide
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeHeader;