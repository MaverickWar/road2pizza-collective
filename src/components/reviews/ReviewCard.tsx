import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ReviewCardProps {
  review: any;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50));

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-up bg-card hover:bg-card-hover border-none shadow-md">
      <CardHeader className="p-0">
        {review.recipes?.image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={review.recipes.image_url}
              alt={review.recipes.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/recipe/${review.recipe_id}`}
              className="text-lg font-semibold hover:text-accent transition-colors line-clamp-1"
            >
              {review.recipes?.title}
            </Link>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{review.rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            by {review.recipes?.author}
          </p>

          <p className="text-sm line-clamp-3">{review.content}</p>

          <div className="flex items-center justify-between pt-4">
            <HoverCard>
              <HoverCardTrigger>
                <div className="flex items-center space-x-2 text-sm text-gray-500 hover:text-accent transition-colors">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.profiles?.username}`}
                    alt={review.profiles?.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{review.profiles?.username}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">
                      {review.profiles?.username}
                    </h4>
                    <p className="text-sm">
                      Joined{" "}
                      {format(new Date(review.created_at), "MMMM yyyy")}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

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
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-accent"
                asChild
              >
                <Link to={`/recipe/${review.recipe_id}#comments`}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Reply
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;