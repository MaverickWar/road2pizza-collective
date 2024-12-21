import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewStats from "@/components/reviews/ReviewStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, Star, TrendingUp } from "lucide-react";

const Reviews = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      console.log("Fetching reviews with recipe and user data");
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
        console.error("Error fetching reviews:", error);
        throw error;
      }

      console.log("Fetched reviews:", data);
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight">Community Reviews</h1>
            <ReviewStats reviews={reviews || []} />
          </div>

          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="recent" className="flex-1 sm:flex-none">
                <TrendingUp className="w-4 h-4 mr-2" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="top-rated" className="flex-1 sm:flex-none">
                <Star className="w-4 h-4 mr-2" />
                Top Rated
              </TabsTrigger>
              <TabsTrigger value="chefs-choice" className="flex-1 sm:flex-none">
                <ChefHat className="w-4 h-4 mr-2" />
                Chef's Choice
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews?.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="top-rated" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews
                  ?.filter((review) => review.rating >= 4)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="chefs-choice" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews
                  ?.filter((review) => review.rating === 5)
                  .map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reviews;