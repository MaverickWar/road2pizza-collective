import { Card, CardContent } from "@/components/ui/card";
import ReviewCard from "./ReviewCard";
import { cn } from "@/lib/utils";
import ReviewStats from "./ReviewStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReviewContentProps {
  reviews: any[];
  isEditMode: boolean;
  hiddenElements: string[];
  onToggleVisibility: (elementId: string) => void;
  onNewReview: () => void;
}

const ReviewContent = ({ 
  reviews, 
  isEditMode, 
  hiddenElements,
  onToggleVisibility,
  onNewReview
}: ReviewContentProps) => {
  const isElementVisible = (elementId: string) => !hiddenElements.includes(elementId);

  // Get featured reviews
  const { data: featuredReviews = [] } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: async () => {
      console.log("Fetching featured reviews");
      const { data, error } = await supabase
        .from('equipment_reviews')
        .select(`
          *,
          profiles:created_by (username)
        `)
        .eq('is_featured', true)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching featured reviews:", error);
        throw error;
      }

      console.log("Fetched featured reviews:", data);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get top 10 reviews by rating
  const { data: topReviews = [] } = useQuery({
    queryKey: ['top-reviews'],
    queryFn: async () => {
      console.log("Fetching top reviews");
      const { data, error } = await supabase
        .from('equipment_reviews')
        .select(`
          *,
          profiles:created_by (username)
        `)
        .eq('is_published', true)
        .order('rating', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching top reviews:", error);
        throw error;
      }

      console.log("Fetched top reviews:", data);
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Get latest admin reviews
  const { data: adminReviews = [] } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      console.log("Fetching admin reviews");
      const { data: adminProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_admin', true);

      if (profileError) throw profileError;

      const adminIds = adminProfiles.map(profile => profile.id);
      
      const { data: reviews, error } = await supabase
        .from('equipment_reviews')
        .select(`
          *,
          profiles:created_by (username)
        `)
        .in('created_by', adminIds)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("Fetched admin reviews:", reviews);
      return reviews || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      {isElementVisible('stats') && (
        <div 
          onClick={() => isEditMode && onToggleVisibility('stats')}
          className={cn(
            isEditMode && "cursor-pointer hover:opacity-50"
          )}
        >
          <ReviewStats reviews={reviews} onNewReview={onNewReview} />
        </div>
      )}

      {isElementVisible('featured-reviews') && featuredReviews.length > 0 && (
        <div 
          onClick={() => isEditMode && onToggleVisibility('featured-reviews')}
          className={cn(
            isEditMode && "cursor-pointer hover:opacity-50"
          )}
        >
          <Card className="border-none bg-highlight shadow-lg">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-6">Featured Reviews</h2>
              <div className="grid gap-6">
                {featuredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isElementVisible('top-reviews') && topReviews.length > 0 && (
        <div 
          onClick={() => isEditMode && onToggleVisibility('top-reviews')}
          className={cn(
            isEditMode && "cursor-pointer hover:opacity-50"
          )}
        >
          <Card className="border-none shadow-lg">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-6">Top Rated Reviews</h2>
              <div className="grid gap-6">
                {topReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isElementVisible('latest-reviews') && adminReviews.length > 0 && (
        <div 
          onClick={() => isEditMode && onToggleVisibility('latest-reviews')}
          className={cn(
            isEditMode && "cursor-pointer hover:opacity-50"
          )}
        >
          <Card className="border-none shadow-lg">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-6">Latest Reviews</h2>
              <div className="grid gap-6">
                {adminReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReviewContent;