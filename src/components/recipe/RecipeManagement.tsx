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
import { Plus, Pencil, Star, Trash2, Eye } from "lucide-react";
import RecipeForm from "./RecipeForm";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const RecipeManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

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

  const calculateAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

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
                {recipes?.map((recipe) => (
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
                      <TooltipProvider>
                        <div className="flex space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditingRecipe(recipe)}
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
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
                {(!recipes || recipes.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                      No recipes found. Create your first recipe!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeManagement;