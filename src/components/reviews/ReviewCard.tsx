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
      <Card className="hover:bg-muted/50 transition-colors">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">{review.title}</h3>
          <div className="text-sm text-muted-foreground mb-2">
            <span>By {review.profiles?.username || review.author}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(review.created_at), 'MMMM d, yyyy')}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
          <div className="mt-2 text-sm">
            Rating: {review.rating}/5
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ReviewCard;