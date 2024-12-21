import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import RecipeTable from "./RecipeTable";
import RecipeForm from "./RecipeForm";
import type { Recipe } from "./types";

const RecipeManagement = () => {
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes-with-reviews"],
    queryFn: async () => {
      console.log("Fetching recipes with reviews...");
      const { data: recipesData, error: recipesError } = await supabase
        .from("recipes")
        .select(`
          *,
          reviews (
            rating,
            content,
            user_id,
            profiles (username)
          ),
          categories (name)
        `);
      
      if (recipesError) {
        console.error("Error fetching recipes:", recipesError);
        throw recipesError;
      }

      console.log("Fetched recipes:", recipesData);
      return recipesData as Recipe[];
    },
  });

  const handleToggleFeature = async (recipeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("recipes")
        .update({ is_featured: !currentStatus })
        .eq("id", recipeId);
      
      if (error) throw error;
      toast.success("Recipe feature status updated");
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe feature status");
    }
  };

  if (editingRecipe) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{editingRecipe ? "Edit Recipe" : "Create Recipe"}</CardTitle>
        </CardHeader>
        <CardContent>
          <RecipeForm
            existingRecipe={editingRecipe}
            onCancel={() => setEditingRecipe(null)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Management</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <RecipeTable
            recipes={recipes || []}
            onEdit={setEditingRecipe}
            onToggleFeature={handleToggleFeature}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeManagement;