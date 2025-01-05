import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    author: string;
    content: string;
    rating: number;
    created_at: string;
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
          <div className="space-y-4">
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
            
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-highlight rounded-full text-sm font-medium">
                Rating: {review.rating}/5
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ReviewCard;