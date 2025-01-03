import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, EyeOff } from "lucide-react";

interface RecipeHeaderProps {
  canEdit: boolean;
  onBack: () => void;
  onEdit: () => void;
  onHide: () => void;
}

const RecipeHeader = ({ canEdit, onBack, onEdit, onHide }: RecipeHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <Button onClick={onBack} variant="outline" size="sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      {canEdit && (
        <div className="space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Recipe
          </Button>
          <Button 
            variant="destructive"
            size="sm"
            onClick={onHide}
          >
            <EyeOff className="w-4 h-4 mr-2" />
            Hide Recipe
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeHeader;