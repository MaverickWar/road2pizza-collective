import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import RecipeForm from "./RecipeForm";
import { TooltipProvider } from "@/components/ui/tooltip";
import RecipeTableRow from "./RecipeTableRow";
import type { Recipe } from "./types";

const RecipeManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
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

      // Also fetch mock recipes from articles
      const { articles } = await import('@/data/articles');
      const mockRecipes = Object.values(articles).map(article => ({
        id: crypto.randomUUID(),
        title: article.title,
        author: article.author,
        category_id: null,
        image_url: article.image || '/placeholder.svg',
        content: article.content,
        ingredients: article.ingredients || [],
        instructions: article.instructions || [],
        tips: article.tips || [],
        nutrition_info: article.nutritionInfo || null,
        created_at: new Date().toISOString(),
        created_by: null,
        prep_time: article.prepTime,
        cook_time: article.cookTime,
        servings: article.servings,
        difficulty: article.difficulty,
        reviews: [],
        categories: null
      }));
      
      // Combine Supabase recipes with mock recipes
      const allRecipes = [...(recipesData || []), ...mockRecipes];
      console.log("All recipes:", allRecipes);
      return allRecipes as Recipe[];
    },
  });

  if (showCreateForm || editingRecipe) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{editingRecipe ? "Edit Recipe" : "Create New Recipe"}</CardTitle>
        </CardHeader>
        <CardContent>
          <RecipeForm 
            onCancel={() => {
              setShowCreateForm(false);
              setEditingRecipe(null);
            }}
            existingRecipe={editingRecipe}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recipe Management</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize your recipes
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Recipe
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipe</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TooltipProvider>
                  {recipes?.map((recipe) => (
                    <RecipeTableRow 
                      key={recipe.id}
                      recipe={recipe}
                      onEdit={setEditingRecipe}
                    />
                  ))}
                  {(!recipes || recipes.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                        No recipes found. Create your first recipe!
                      </TableCell>
                    </TableRow>
                  )}
                </TooltipProvider>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeManagement;