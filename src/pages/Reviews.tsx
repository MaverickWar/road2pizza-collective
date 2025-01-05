import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewStats from "@/components/reviews/ReviewStats";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import NewReviewButton from "@/components/reviews/NewReviewButton";
import ReviewForm from "@/components/reviews/ReviewForm";

const Reviews = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  
  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ["recipe-reviews"],
    queryFn: async () => {
      console.log("Fetching all reviews");
      const { data, error } = await supabase
        .from("equipment_reviews")
        .select(`
          *,
          profiles:created_by (username)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
      return data;
    },
  });

  const { data: featuredReview, isLoading: loadingFeatured } = useQuery({
    queryKey: ["featured-review"],
    queryFn: async () => {
      console.log("Fetching featured review");
      const { data, error } = await supabase
        .from("featured_reviews")
        .select(`
          *,
          equipment_reviews (*)
        `)
        .eq("is_featured", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching featured review:", error);
        throw error;
      }
      return data?.equipment_reviews;
    },
  });

  const { data: topRated, isLoading: loadingTopRated } = useQuery({
    queryKey: ["top-rated-reviews"],
    queryFn: async () => {
      console.log("Fetching top rated reviews");
      const { data, error } = await supabase
        .from("featured_reviews")
        .select(`
          *,
          equipment_reviews (*)
        `)
        .eq("is_featured", false)
        .order("display_order", { ascending: true })
        .limit(5);

      if (error) {
        console.error("Error fetching top rated reviews:", error);
        throw error;
      }
      return data?.map(item => item.equipment_reviews);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-36 md:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-8 h-8 text-accent" />
                  <h1 className="text-2xl font-bold tracking-tight whitespace-nowrap">Pizza Oven Reviews</h1>
                </div>
                <p className="text-gray-500 text-left">
                  Expert reviews and community insights on the best pizza ovens
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ReviewStats reviews={reviews || []} />
                <NewReviewButton onClick={() => setIsReviewFormOpen(true)} />
              </div>
            </div>

            {featuredReview && (
              <Card className="bg-orange-100 dark:bg-orange-900/20 border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {featuredReview.image_url && (
                      <div className="w-full md:w-1/3">
                        <img
                          src={featuredReview.image_url}
                          alt={featuredReview.title}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="w-full md:w-2/3 space-y-4 text-left">
                      <div className="space-y-2">
                        <div className="inline-block px-3 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                          Featured Review
                        </div>
                        <h2 className="text-2xl font-bold">{featuredReview.title}</h2>
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
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-left">Top Rated Pizza Ovens</h2>
                <div className="space-y-6">
                  {topRated?.map((review, index) => (
                    <div
                      key={review.id}
                      className="flex items-start gap-4 pb-6 border-b last:border-0"
                    >
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-900/20 rounded-full">
                        <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-grow text-left">
                        <h3 className="text-lg font-semibold mb-2">{review.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                          {review.content}
                        </p>
                        <Link
                          to={`/reviews/${review.id}`}
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                        >
                          View full review →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-left">Latest Reviews</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
