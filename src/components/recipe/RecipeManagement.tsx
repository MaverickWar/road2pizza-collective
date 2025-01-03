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
import { ChefHat, Clock, CheckSquare, XSquare } from "lucide-react";

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
            username,
            requires_recipe_approval,
            points,
            badge_title,
            badge_color,
            recipes_shared,
            created_at
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching recipes:", error);
        throw error;
      }
      
      return data as unknown as Recipe[];
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
        .update({ 
          approval_status: status,
          edit_requires_approval: false // Reset the edit approval flag
        })
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

  const pendingRecipes = recipes?.filter(recipe => 
    recipe.approval_status === 'pending' || recipe.edit_requires_approval
  ) || [];
  const approvedRecipes = recipes?.filter(recipe => 
    recipe.approval_status === 'approved' && !recipe.edit_requires_approval
  ) || [];
  const rejectedRecipes = recipes?.filter(recipe => recipe.approval_status === 'rejected') || [];

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-accent" />
            <span>Recipe Management</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {pendingRecipes.length} Pending
            </Badge>
            <Badge variant="default" className="flex items-center gap-1">
              <CheckSquare className="w-4 h-4" />
              {approvedRecipes.length} Approved
            </Badge>
            <Badge variant="destructive" className="flex items-center gap-1">
              <XSquare className="w-4 h-4" />
              {rejectedRecipes.length} Rejected
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-background/50 p-1">
            <TabsTrigger value="pending" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              Pending Approval
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-accent data-[state=active]:text-white">
              Rejected
            </TabsTrigger>
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