import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Recipe } from "./types";

interface RecipeTableRowProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
}

const calculateAverageRating = (reviews: Recipe['reviews']) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

const RecipeTableRow = ({ recipe, onEdit }: RecipeTableRowProps) => {
  return (
    <TableRow key={recipe.id}>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{recipe.title}</div>
          <div className="text-sm text-muted-foreground">
            by {recipe.author}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          {recipe.categories?.name || 'Uncategorized'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="text-sm">
            {recipe.reviews?.length || 0} reviews
          </div>
          {recipe.reviews?.length > 0 && (
            <div className="text-sm text-yellow-500">
              {calculateAverageRating(recipe.reviews)} ⭐
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(recipe)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Recipe</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = `/article/${recipe.id}`}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Recipe</TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RecipeTableRow;