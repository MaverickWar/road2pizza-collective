import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ArticleContent from "./ArticleContent";
import type { Recipe } from "@/types/recipe";
import { Skeleton } from "@/components/ui/skeleton";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();

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

  return <ArticleContent recipe={recipe} />;
};

export default ArticleDetail;