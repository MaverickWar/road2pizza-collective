import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import RecipeTable from "./RecipeTable";
import { Recipe } from "./types";

const RecipeManagement = () => {
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const queryClient = useQueryClient();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes-with-reviews"],
    queryFn: async () => {
      console.log("Fetching recipes with reviews...");
      const { data, error } = await supabase
        .from("recipes")
        .select(`
          *,
          reviews (
            rating,
            content,
            user_id,
            profiles (username)
          ),
          categories (
            id,
            name
          )
        `);
      
      if (error) {
        console.error("Error fetching recipes:", error);
        throw error;
      }
      
      console.log("Fetched recipes:", data);
      return data as Recipe[];
    },
  });

  const handleToggleFeature = async (recipeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("recipes")
        .update({ is_featured: !currentStatus })
        .eq("id", recipeId);
      
      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ["recipes-with-reviews"] });
      toast.success("Recipe feature status updated");
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe feature status");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recipe Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-secondary/50 rounded-lg" />
            ))}
          </div>
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
        <RecipeTable
          recipes={recipes || []}
          onEdit={setEditingRecipe}
          onToggleFeature={handleToggleFeature}
        />
      </CardContent>
    </Card>
  );
};

export default RecipeManagement;