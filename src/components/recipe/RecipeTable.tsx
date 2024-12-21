import { Table, TableBody } from "@/components/ui/table";
import RecipeTableHeader from "./RecipeTableHeader";
import RecipeTableRow from "./RecipeTableRow";
import { Recipe } from "./types";

interface RecipeTableProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onToggleFeature: (recipeId: string, currentStatus: boolean) => void;
}

const RecipeTable = ({ recipes, onEdit, onToggleFeature }: RecipeTableProps) => {
  return (
    <Table>
      <RecipeTableHeader />
      <TableBody>
        {recipes?.map((recipe) => (
          <RecipeTableRow
            key={recipe.id}
            recipe={recipe}
            onEdit={onEdit}
            onToggleFeature={onToggleFeature}
          />
        ))}
        {(!recipes || recipes.length === 0) && (
          <tr>
            <td colSpan={4} className="text-center text-muted-foreground py-6">
              No recipes found
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  );
};

export default RecipeTable;