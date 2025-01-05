import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Star, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/Rating";

interface ReviewCardProps {
  review: any;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50));

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-up bg-card hover:bg-card-hover border-none shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          {review.image_url && (
            <div className="relative h-48 overflow-hidden rounded-lg">
              <img
                src={review.image_url}
                alt={review.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Link
                to={`/reviews/${review.id}`}
                className="text-lg font-semibold hover:text-accent transition-colors line-clamp-1"
              >
                {review.title}
              </Link>
              <Rating value={review.rating} />
            </div>

            <p className="text-sm text-gray-500">
              by {review.author}
            </p>

            <p className="text-sm line-clamp-3">{review.content}</p>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:text-accent"
                  onClick={() => {
                    setIsLiked(!isLiked);
                    setLikes(isLiked ? likes - 1 : likes + 1);
                  }}
                >
                  <ThumbsUp
                    className={`w-4 h-4 mr-1 ${
                      isLiked ? "fill-accent text-accent" : ""
                    }`}
                  />
                  {likes}
                </Button>
              </div>
              <Link
                to={`/reviews/${review.id}`}
                className="text-sm text-accent hover:text-accent/80 font-medium"
              >
                Read more →
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;