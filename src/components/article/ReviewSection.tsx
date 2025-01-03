import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { Rating } from "@/components/Rating";
import { Review } from "@/components/recipe/types";

interface ReviewSectionProps {
  reviews: Review[];
}

const ReviewSection = ({ reviews }: ReviewSectionProps) => {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="bg-secondary rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Avatar>
                <AvatarFallback>{getInitials(review.profiles.username)}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="font-semibold">{review.profiles.username}</p>
                <p className="text-sm text-gray-500">{format(new Date(review.created_at), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
            <Rating value={review.rating} />
            <p className="mt-2">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;