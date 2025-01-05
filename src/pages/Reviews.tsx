import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewStats from "@/components/reviews/ReviewStats";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat } from "lucide-react";

const Reviews = () => {
  const { data: reviews, isLoading } = useQuery({
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-36 md:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-8 h-8 text-accent" />
                  <h1 className="text-4xl font-bold tracking-tight">
                    Community Reviews
                  </h1>
                </div>
                <p className="text-gray-500">
                  Discover what our community thinks about their cooking experiences
                </p>
              </div>
              <ReviewStats reviews={reviews || []} />
            </div>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-48 bg-secondary animate-pulse rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews?.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reviews;