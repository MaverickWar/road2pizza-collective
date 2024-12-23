import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import ReviewCard from "@/components/reviews/ReviewCard";
import EquipmentReviewCard from "@/components/reviews/EquipmentReviewCard";
import ReviewStats from "@/components/reviews/ReviewStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Star, TrendingUp, Wrench } from "lucide-react";

const Reviews = () => {
  const { data: recipeReviews, isLoading: loadingRecipeReviews } = useQuery({
    queryKey: ["recipe-reviews"],
    queryFn: async () => {
      console.log("Fetching recipe reviews");
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles (username),
          recipes (
            title,
            image_url,
            author
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching recipe reviews:", error);
        throw error;
      }
      return data;
    },
  });

  const { data: equipmentReviews, isLoading: loadingEquipmentReviews } = useQuery({
    queryKey: ["equipment-reviews"],
    queryFn: async () => {
      console.log("Fetching equipment reviews");
      const { data, error } = await supabase
        .from("equipment_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching equipment reviews:", error);
        throw error;
      }
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-36 md:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-4xl font-bold tracking-tight">Community Reviews</h1>
              <ReviewStats reviews={recipeReviews || []} />
            </div>

          <Tabs defaultValue="recipes" className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="recipes" className="flex-1 sm:flex-none">
                <ChefHat className="w-4 h-4 mr-2" />
                Recipe Reviews
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex-1 sm:flex-none">
                <Wrench className="w-4 h-4 mr-2" />
                Equipment Reviews
              </TabsTrigger>
              <TabsTrigger value="top-rated" className="flex-1 sm:flex-none">
                <Star className="w-4 h-4 mr-2" />
                Top Rated
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex-1 sm:flex-none">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recipes" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loadingRecipeReviews ? (
                  <div>Loading recipe reviews...</div>
                ) : (
                  recipeReviews?.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="equipment" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loadingEquipmentReviews ? (
                  <div>Loading equipment reviews...</div>
                ) : (
                  equipmentReviews?.map((review) => (
                    <EquipmentReviewCard key={review.id} review={review} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="top-rated" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recipeReviews
                  ?.filter((review) => review.rating >= 4)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {equipmentReviews
                  ?.filter((review) => review.rating >= 4)
                  .map((review) => (
                    <EquipmentReviewCard key={review.id} review={review} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reviews;
