import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    author: string;
    content: string;
    rating: number;
    created_at: string;
    image_url?: string;
    profiles?: {
      username: string;
    };
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Link to={`/reviews/${review.id}`}>
      <Card className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br from-secondary to-secondary-hover border-none">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-textLight mb-1 line-clamp-2">
                  {review.title}
                </h3>
                <div className="flex items-center text-sm text-textLight/80 space-x-2">
                  <span className="font-medium">
                    {review.profiles?.username || review.author}
                  </span>
                  <span>•</span>
                  <span>{format(new Date(review.created_at), 'MMMM d, yyyy')}</span>
                </div>
              </div>
              
              <p className="text-textLight/90 line-clamp-3 text-sm">
                {review.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "fill-highlight text-highlight" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-accent hover:text-accent-hover">
                  Read more →
                </span>
              </div>
            </div>
            
            {review.image_url && (
              <div className="hidden sm:block w-32 h-32 flex-shrink-0">
                <img
                  src={review.image_url}
                  alt={review.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ReviewCard;