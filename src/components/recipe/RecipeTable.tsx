import { Table, TableBody } from "@/components/ui/table";
import RecipeTableHeader from "./RecipeTableHeader";
import RecipeTableRow from "./RecipeTableRow";
import { Recipe } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecipeTableProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onToggleFeature: (recipeId: string, currentStatus: boolean) => void;
  onApprove?: (recipeId: string) => void;
  onReject?: (recipeId: string) => void;
  showApprovalActions?: boolean;
}

const RecipeTable = ({ 
  recipes, 
  onEdit, 
  onToggleFeature,
  onApprove,
  onReject,
  showApprovalActions 
}: RecipeTableProps) => {
  return (
    <ScrollArea className="rounded-md border">
      <div className="min-w-[600px]">
        <Table>
          <RecipeTableHeader showApprovalActions={showApprovalActions} />
          <TableBody>
            {recipes?.map((recipe) => (
              <RecipeTableRow
                key={recipe.id}
                recipe={recipe}
                onEdit={onEdit}
                onToggleFeature={onToggleFeature}
                onApprove={onApprove}
                onReject={onReject}
                showApprovalActions={showApprovalActions}
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
      </div>
    </ScrollArea>
  );
};

export default RecipeTable;