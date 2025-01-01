import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import RecipeTable from "./RecipeTable";
import { Recipe } from "./types";
import EditRecipeModal from "../article/EditRecipeModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
            created_at,
            profiles (username)
          ),
          categories (
            id,
            name
          ),
          profiles (
            username
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching recipes:", error);
        throw error;
      }
      
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
        approval_status: (recipe.approval_status === 'pending' || 
                         recipe.approval_status === 'approved' || 
                         recipe.approval_status === 'rejected')
          ? recipe.approval_status
          : 'pending',
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

  const handleApproval = async (recipeId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from("recipes")
        .update({ approval_status: status })
        .eq("id", recipeId);
      
      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ["recipes-with-reviews"] });
      toast.success(`Recipe ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error("Error updating recipe approval:", error);
      toast.error("Failed to update recipe approval status");
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

  const pendingRecipes = recipes?.filter(recipe => recipe.approval_status === 'pending') || [];
  const approvedRecipes = recipes?.filter(recipe => recipe.approval_status === 'approved') || [];
  const rejectedRecipes = recipes?.filter(recipe => recipe.approval_status === 'rejected') || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recipe Management</span>
          <div className="flex gap-2">
            <Badge variant="secondary">{pendingRecipes.length} Pending</Badge>
            <Badge variant="default">{approvedRecipes.length} Approved</Badge>
            <Badge variant="destructive">{rejectedRecipes.length} Rejected</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <RecipeTable
              recipes={pendingRecipes}
              onEdit={setEditingRecipe}
              onToggleFeature={handleToggleFeature}
              onApprove={(id) => handleApproval(id, 'approved')}
              onReject={(id) => handleApproval(id, 'rejected')}
              showApprovalActions
            />
          </TabsContent>

          <TabsContent value="approved">
            <RecipeTable
              recipes={approvedRecipes}
              onEdit={setEditingRecipe}
              onToggleFeature={handleToggleFeature}
            />
          </TabsContent>

          <TabsContent value="rejected">
            <RecipeTable
              recipes={rejectedRecipes}
              onEdit={setEditingRecipe}
              onToggleFeature={handleToggleFeature}
              onApprove={(id) => handleApproval(id, 'approved')}
              showApprovalActions
            />
          </TabsContent>
        </Tabs>

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