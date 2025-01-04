import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, EyeOff, Eye } from "lucide-react";

interface RecipeHeaderProps {
  canEdit: boolean;
  isHidden: boolean;
  onBack: () => void;
  onEdit: () => void;
  onHide: () => void;
}

const RecipeHeader = ({ canEdit, isHidden, onBack, onEdit, onHide }: RecipeHeaderProps) => {
  console.log('RecipeHeader: Rendering with canEdit:', canEdit, 'isHidden:', isHidden);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <Button onClick={onBack} variant="outline" size="sm" className="self-start">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      {canEdit && (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="w-full sm:w-auto"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Recipe
          </Button>
          <Button 
            variant={isHidden ? "default" : "destructive"}
            size="sm"
            onClick={onHide}
            className="w-full sm:w-auto"
          >
            {isHidden ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Publish Recipe
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Recipe
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeHeader;