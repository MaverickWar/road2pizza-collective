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

  // Get top 10 reviews by rating
  const topReviews = [...reviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // Get featured reviews
  const featuredReviews = reviews.filter(review => review.is_featured);

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

      {isElementVisible('top-reviews') && (
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

      {isElementVisible('latest-reviews') && (
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
                {reviews?.map((review) => (
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