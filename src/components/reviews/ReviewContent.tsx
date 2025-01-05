import { Card, CardContent } from "@/components/ui/card";
import ReviewCard from "./ReviewCard";
import { cn } from "@/lib/utils";

interface ReviewContentProps {
  reviews: any[];
  isEditMode: boolean;
  hiddenElements: string[];
  onToggleVisibility: (elementId: string) => void;
}

const ReviewContent = ({ 
  reviews, 
  isEditMode, 
  hiddenElements,
  onToggleVisibility 
}: ReviewContentProps) => {
  const isElementVisible = (elementId: string) => !hiddenElements.includes(elementId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4">
      {isElementVisible('description') && (
        <div 
          onClick={() => isEditMode && onToggleVisibility('description')}
          className={cn(
            "text-gray-500",
            isEditMode && "cursor-pointer hover:opacity-50"
          )}
        >
          <p>Expert reviews and insights on the best pizza ovens</p>
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