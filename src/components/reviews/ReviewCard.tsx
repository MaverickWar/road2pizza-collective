import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/Rating";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

interface ReviewCardProps {
  review: any;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50));
  const [isPublished, setIsPublished] = useState(review.is_published);
  const { user } = useAuth();

  const isOwner = user?.id === review.created_by;

  const togglePublishState = async () => {
    try {
      const { error } = await supabase
        .from('equipment_reviews')
        .update({ is_published: !isPublished })
        .eq('id', review.id);

      if (error) throw error;

      setIsPublished(!isPublished);
      toast.success(`Review ${isPublished ? 'unpublished' : 'published'} successfully`);
    } catch (error) {
      console.error('Error toggling publish state:', error);
      toast.error('Failed to update review status');
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-up bg-card hover:bg-card-hover border-none shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <Link
              to={`/reviews/${review.id}`}
              className="text-lg font-semibold hover:text-accent transition-colors line-clamp-1"
            >
              {review.title}
            </Link>

            <p className="text-sm text-gray-500">
              by {review.author}
            </p>

            <p className="text-sm line-clamp-2">{review.content}</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-[80px] h-[80px] flex-shrink-0">
              {review.image_url ? (
                <img
                  src={review.image_url}
                  alt={review.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground text-xs">
                  No image
                </div>
              )}
            </div>
            <Rating value={review.rating} />
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-accent text-xs px-2"
              onClick={() => {
                setIsLiked(!isLiked);
                setLikes(isLiked ? likes - 1 : likes + 1);
              }}
            >
              <ThumbsUp
                className={`w-3 h-3 mr-1 ${
                  isLiked ? "fill-accent text-accent" : ""
                }`}
              />
              {likes}
            </Button>

            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePublishState}
                className="text-xs px-2"
              >
                {isPublished ? (
                  <EyeOff className="w-3 h-3 mr-1" />
                ) : (
                  <Eye className="w-3 h-3 mr-1" />
                )}
                {isPublished ? 'Unpublish' : 'Publish'}
              </Button>
            )}
          </div>
          <Link
            to={`/reviews/${review.id}`}
            className="text-xs text-accent hover:text-accent/80 font-medium"
          >
            Read more →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;