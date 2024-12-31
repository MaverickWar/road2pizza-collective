import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import RecipeTable from "./RecipeTable";
import { Recipe } from "./types";
import EditRecipeModal from "../article/EditRecipeModal";

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
          ),
          profiles (
            username
          )
        `);
      
      if (error) {
        console.error("Error fetching recipes:", error);
        throw error;
      }
      
      // Transform the data to match the Recipe type
      const transformedRecipes: Recipe[] = data.map(recipe => ({
        ...recipe,
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.map(String) : [],
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions.map(String) : [],
        tips: Array.isArray(recipe.tips) ? recipe.tips.map(String) : [],
        reviews: recipe.reviews || [],
        profiles: recipe.profiles || { username: '' },
        status: (recipe.status === 'published' || recipe.status === 'unpublished') 
          ? recipe.status 
          : 'unpublished',
        nutrition_info: recipe.nutrition_info && typeof recipe.nutrition_info === 'object' && !Array.isArray(recipe.nutrition_info) ? {
          calories: String((recipe.nutrition_info as Record<string, unknown>).calories || ''),
          protein: String((recipe.nutrition_info as Record<string, unknown>).protein || ''),
          carbs: String((recipe.nutrition_info as Record<string, unknown>).carbs || ''),
          fat: String((recipe.nutrition_info as Record<string, unknown>).fat || '')
        } : null
      }));
      
      console.log("Fetched recipes:", transformedRecipes);
      return transformedRecipes;
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
        {editingRecipe && (
          <EditRecipeModal
            recipe={editingRecipe}
            onClose={() => setEditingRecipe(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeManagement;