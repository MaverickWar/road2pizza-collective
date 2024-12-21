import { TableCell, TableRow } from "@/components/ui/table";
import { Recipe } from "./types";
import RecipeStats from "./RecipeStats";
import RecipeActions from "./RecipeActions";

interface RecipeTableRowProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onToggleFeature: (recipeId: string, currentStatus: boolean) => void;
}

const RecipeTableRow = ({ recipe, onEdit, onToggleFeature }: RecipeTableRowProps) => {
  const handleEdit = () => {
    console.log("Editing recipe:", recipe);
    onEdit(recipe);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{recipe.title}</div>
          <div className="text-sm text-muted-foreground">
            by {recipe.author}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {recipe.categories?.name || "Uncategorized"}
      </TableCell>
      <TableCell>
        <RecipeStats reviews={recipe.reviews} />
      </TableCell>
      <TableCell>
        <RecipeActions
          isFeatured={recipe.is_featured || false}
          onToggleFeature={() => onToggleFeature(recipe.id, recipe.is_featured || false)}
          onEdit={handleEdit}
        />
      </TableCell>
    </TableRow>
  );
};

export default RecipeTableRow;