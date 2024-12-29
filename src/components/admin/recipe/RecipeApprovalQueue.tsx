import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

const RecipeApprovalQueue = () => {
  const queryClient = useQueryClient();

  const { data: pendingRecipes, isLoading } = useQuery({
    queryKey: ["pending-recipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(`
          *,
          profiles (username),
          categories (name)
        `)
        .eq("status", "unpublished")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateRecipeStatus = useMutation({
    mutationFn: async ({
      recipeId,
      status,
    }: {
      recipeId: string;
      status: "published" | "rejected";
    }) => {
      const { error } = await supabase
        .from("recipes")
        .update({ status })
        .eq("id", recipeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-recipes"] });
      toast.success("Recipe status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating recipe status:", error);
      toast.error("Failed to update recipe status");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recipe Approval Queue</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingRecipes?.map((recipe) => (
            <TableRow key={recipe.id}>
              <TableCell>{recipe.title}</TableCell>
              <TableCell>{recipe.profiles.username}</TableCell>
              <TableCell>{recipe.categories?.name}</TableCell>
              <TableCell>
                {format(new Date(recipe.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      updateRecipeStatus.mutate({
                        recipeId: recipe.id,
                        status: "published",
                      })
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      updateRecipeStatus.mutate({
                        recipeId: recipe.id,
                        status: "rejected",
                      })
                    }
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(!pendingRecipes || pendingRecipes.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No pending recipes to review
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecipeApprovalQueue;