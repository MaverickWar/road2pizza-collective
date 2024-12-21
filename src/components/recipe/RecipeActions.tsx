import { Button } from "@/components/ui/button";
import { Star, Pencil } from "lucide-react";

interface RecipeActionsProps {
  isFeatured: boolean;
  onToggleFeature: () => void;
  onEdit: () => void;
}

const RecipeActions = ({ isFeatured, onToggleFeature, onEdit }: RecipeActionsProps) => {
  return (
    <div className="space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleFeature}
      >
        <Star className={`w-4 h-4 ${isFeatured ? "text-yellow-500" : ""}`} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
      >
        <Pencil className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default RecipeActions;