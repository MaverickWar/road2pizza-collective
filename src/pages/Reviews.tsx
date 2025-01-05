import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewStats from "@/components/reviews/ReviewStats";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";
import ReviewForm from "@/components/reviews/ReviewForm";

const Reviews = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  
  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ["pizza-oven-reviews"],
    queryFn: async () => {
      console.log("Fetching pizza oven reviews");
      const { data, error } = await supabase
        .from("equipment_reviews")
        .select(`
          *,
          profiles:created_by (username)
        `)
        .eq('category', 'Pizza Oven')
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
      return data;
    },
  });

  const { data: featuredReview } = useQuery({
    queryKey: ["featured-pizza-oven-review"],
    queryFn: async () => {
      console.log("Fetching featured pizza oven review");
      const { data, error } = await supabase
        .from("featured_reviews")
        .select(`
          *,
          equipment_reviews (*)
        `)
        .eq('is_featured', true)
        .eq('equipment_reviews.category', 'Pizza Oven')
        .maybeSingle();

      if (error) {
        console.error("Error fetching featured review:", error);
        throw error;
      }
      return data?.equipment_reviews;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 md:pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-8 h-8 text-accent" />
                <h1 className="text-2xl font-bold tracking-tight">Pizza Oven Reviews</h1>
              </div>
              <p className="text-gray-500">
                Expert reviews and insights on the best pizza ovens
              </p>
              <ReviewStats reviews={reviews || []} onNewReview={() => setIsReviewFormOpen(true)} />
            </div>

            {featuredReview && (
              <Card className="bg-orange-100 dark:bg-orange-900/20 border-none shadow-lg">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {featuredReview.image_url && (
                      <div className="w-full md:w-1/3">
                        <img
                          src={featuredReview.image_url}
                          alt={featuredReview.title}
                          className="w-full aspect-video md:aspect-square object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="inline-block px-3 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                          Featured Review
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold">{featuredReview.title}</h2>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                        {featuredReview.content}
                      </p>
                      <Link
                        to={`/reviews/${featuredReview.id}`}
                        className="inline-block text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                      >
                        Read full review →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-none shadow-lg">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Latest Reviews</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  {reviews?.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ReviewForm 
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
      />
    </div>
  );
};

export default Reviews;