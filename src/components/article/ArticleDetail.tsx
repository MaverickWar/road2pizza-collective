import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Recipe } from "@/components/recipe/types";
import { Skeleton } from "@/components/ui/skeleton";
import RecipeContent from "./RecipeContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      console.log("Fetching recipe with id:", id);
      const { data, error } = await supabase
        .from("recipes")
        .select(`
          *,
          profiles:created_by (
            id,
            username,
            points,
            badge_title,
            badge_color,
            recipes_shared,
            created_at,
            email
          ),
          categories (
            name,
            id
          ),
          reviews (
            id,
            rating,
            content,
            created_at,
            user_id,
            profiles:user_id (
              username,
              badge_title,
              badge_color
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching recipe:", error);
        throw error;
      }

      console.log("Fetched recipe data:", data);
      return data as Recipe;
    },
  });

  const handleBack = () => {
    if (recipe?.categories?.name) {
      // Map common pizza styles to their URL slugs
      const styleMap: { [key: string]: string } = {
        "Neapolitan Pizza": "neapolitan",
        "New York Style Pizza": "new-york",
        "Chicago Deep Dish": "chicago",
        "Detroit Style Pizza": "detroit",
        "Sicilian Pizza": "sicilian",
        "Thin & Crispy Pizza": "thin-crispy"
      };

      const categorySlug = styleMap[recipe.categories.name] || 
        recipe.categories.name
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^a-z0-9-]/g, "");

      console.log("Navigating back to category:", categorySlug);
      navigate(`/pizza/${categorySlug}`);
    } else {
      console.log("No category found, navigating to main pizza page");
      navigate("/pizza");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[300px]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-muted-foreground">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={handleBack}
        className="mb-6 hover:bg-accent/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {recipe.categories?.name || "Pizza Styles"}
      </Button>
      <RecipeContent recipe={recipe} />
    </div>
  );
};

export default ArticleDetail;