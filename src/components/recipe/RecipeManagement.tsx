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
import { Plus, Pencil, Star } from "lucide-react";
import RecipeForm from "./RecipeForm";

const RecipeManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Fetch recipes with their reviews and categories
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
      return allRecipes;
    },
  });

  if (isLoading) {
    return <div>Loading recipes...</div>;
  }

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
        <CardTitle>Recipe Management</CardTitle>
        <Button onClick={() => setShowCreateForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Recipe
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes?.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{recipe.title}</TableCell>
                  <TableCell>{recipe.categories?.name || 'Uncategorized'}</TableCell>
                  <TableCell>{recipe.author}</TableCell>
                  <TableCell>
                    {recipe.reviews?.length || 0} reviews
                    {recipe.reviews?.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Avg: {(recipe.reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / recipe.reviews.length).toFixed(1)} ⭐
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingRecipe(recipe)}
                      className="hover:bg-secondary"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!recipes || recipes.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No recipes found. Create your first recipe!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeManagement;