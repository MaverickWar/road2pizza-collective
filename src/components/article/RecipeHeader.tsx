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
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <Button onClick={onBack} variant="outline" size="sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      {canEdit && (
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Recipe
          </Button>
          <Button 
            variant={isHidden ? "default" : "destructive"}
            size="sm"
            onClick={onHide}
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