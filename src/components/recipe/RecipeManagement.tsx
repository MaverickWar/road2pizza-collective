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
import { Plus, Pencil } from "lucide-react";
import RecipeForm from "./RecipeForm";

const RecipeManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch recipes with their reviews
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
          )
        `);
      
      if (error) {
        console.error("Error fetching recipes:", error);
        throw error;
      }
      console.log("Fetched recipes:", data);
      return data;
    },
  });

  if (showCreateForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create New Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <RecipeForm onCancel={() => setShowCreateForm(false)} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recipe Management</CardTitle>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Recipe
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes?.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell className="font-medium">{recipe.title}</TableCell>
                <TableCell>{recipe.author}</TableCell>
                <TableCell>
                  {recipe.reviews?.length || 0} reviews
                  {recipe.reviews?.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Avg: {(recipe.reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / recipe.reviews.length).toFixed(1)} ⭐
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecipeManagement;