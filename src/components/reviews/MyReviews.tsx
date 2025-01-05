import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MessageSquare } from "lucide-react";
import ReviewCard from "./ReviewCard";
import EquipmentReviewCard from "./EquipmentReviewCard";

interface RecipeReview {
  id: string;
  recipe_id: string;
  user_id: string;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
  recipes: {
    title: string;
    author: string;
  };
}

const MyReviews = () => {
  const { user } = useAuth();

  const { data: recipeReviews, isLoading: loadingRecipeReviews } = useQuery({
    queryKey: ["my-recipe-reviews"],
    queryFn: async () => {
      console.log("Fetching user's recipe reviews...");
      const { data, error } = await supabase
        .from("reviews")
        .select("*, recipes(*)")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data as RecipeReview[];
    },
  });

  const { data: equipmentReviews, isLoading: loadingEquipmentReviews } = useQuery({
    queryKey: ["my-equipment-reviews"],
    queryFn: async () => {
      console.log("Fetching user's equipment reviews...");
      const { data, error } = await supabase
        .from("equipment_reviews")
        .select("*")
        .eq("created_by", user?.id);
      if (error) throw error;
      return data;
    },
  });

  if (loadingRecipeReviews || loadingEquipmentReviews) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="recipes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Recipe Reviews
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Equipment Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <Card>
            <CardHeader>
              <CardTitle>My Recipe Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recipeReviews?.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={{
                      id: review.id,
                      title: review.recipes.title,
                      author: review.recipes.author,
                      content: review.content,
                      rating: review.rating,
                      created_at: review.created_at,
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>My Equipment Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {equipmentReviews?.map((review) => (
                  <EquipmentReviewCard key={review.id} review={review} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyReviews;