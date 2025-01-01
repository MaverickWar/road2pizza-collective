import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface RecipeApprovalTableProps {
  pendingRecipes: any[];
}

const RecipeApprovalTable = ({ pendingRecipes }: RecipeApprovalTableProps) => {
  const queryClient = useQueryClient();

  const handleApproval = async (recipeId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ approval_status: status })
        .eq('id', recipeId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['pending-recipes'] });
      toast.success(`Recipe ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating recipe status:', error);
      toast.error('Failed to update recipe status');
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingRecipes?.map((recipe) => (
          <TableRow key={recipe.id}>
            <TableCell>{recipe.title}</TableCell>
            <TableCell>{recipe.author}</TableCell>
            <TableCell>
              {format(new Date(recipe.created_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleApproval(recipe.id, 'approved')}
                >
                  <Check className="w-4 h-4 text-green-500" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleApproval(recipe.id, 'rejected')}
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {(!pendingRecipes || pendingRecipes.length === 0) && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              No pending recipes to review
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default RecipeApprovalTable;