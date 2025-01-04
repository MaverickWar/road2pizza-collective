import { Button } from "@/components/ui/button";
import { Star, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RecipeActionsProps {
  isFeatured: boolean;
  onToggleFeature: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const RecipeActions = ({ isFeatured, onToggleFeature, onEdit, onDelete }: RecipeActionsProps) => {
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the recipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecipeActions;