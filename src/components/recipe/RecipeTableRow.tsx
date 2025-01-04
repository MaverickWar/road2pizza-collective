import { TableCell, TableRow } from "@/components/ui/table";
import { Recipe } from "./types";
import RecipeStats from "./RecipeStats";
import RecipeActions from "./RecipeActions";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface RecipeTableRowProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onToggleFeature: (recipeId: string, currentStatus: boolean) => void;
  onApprove?: (recipeId: string) => void;
  onReject?: (recipeId: string) => void;
  showApprovalActions?: boolean;
}

const RecipeTableRow = ({ 
  recipe, 
  onEdit, 
  onToggleFeature,
  onApprove,
  onReject,
  showApprovalActions 
}: RecipeTableRowProps) => {
  const queryClient = useQueryClient();

  const handleEdit = () => {
    console.log("Editing recipe:", recipe);
    onEdit(recipe);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", recipe.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["recipes-with-reviews"] });
      toast.success("Recipe deleted successfully");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    }
  };

  return (
    <TableRow className={recipe.approval_status === 'pending' ? 'opacity-60' : ''}>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{recipe.title}</div>
          <div className="text-sm text-muted-foreground">
            by {recipe.profiles?.username || recipe.author}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {recipe.categories?.name || "Uncategorized"}
      </TableCell>
      <TableCell>
        <RecipeStats reviews={recipe.reviews} />
      </TableCell>
      <TableCell className="space-x-2">
        <RecipeActions
          isFeatured={recipe.is_featured || false}
          onToggleFeature={() => onToggleFeature(recipe.id, recipe.is_featured || false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {showApprovalActions && onApprove && onReject && (
          <div className="flex space-x-2 mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onApprove(recipe.id)}
            >
              <Check className="w-4 h-4 text-green-500" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onReject(recipe.id)}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default RecipeTableRow;