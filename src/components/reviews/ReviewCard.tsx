import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, Star, Award, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/Rating";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

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
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-up">
      <div className="grid md:grid-cols-[2fr,1fr] gap-6 p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <Link
                to={`/reviews/${review.id}`}
                className="text-xl font-semibold hover:text-admin transition-colors line-clamp-1 group-hover:text-admin"
              >
                {review.title}
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                by {review.author} · {review.category}
              </p>
            </div>
            {review.is_featured && (
              <Badge variant="secondary" className="bg-admin/10 text-admin">
                <Award className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">{review.rating}/5</span>
            </div>
            {review.price_range && (
              <Badge variant="outline" className="text-sm">
                {review.price_range}
              </Badge>
            )}
          </div>

          <p className="text-sm line-clamp-2 text-muted-foreground">{review.content}</p>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-admin text-xs"
              onClick={() => {
                setIsLiked(!isLiked);
                setLikes(isLiked ? likes - 1 : likes + 1);
              }}
            >
              <ThumbsUp
                className={`w-3 h-3 mr-1 ${
                  isLiked ? "fill-admin text-admin" : ""
                }`}
              />
              {likes}
            </Button>
            <Link
              to={`/reviews/${review.id}`}
              className="text-xs text-admin hover:text-admin-hover font-medium flex items-center gap-1"
            >
              Read full review
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="relative h-full min-h-[200px] rounded-lg overflow-hidden bg-secondary/10">
          {review.image_url ? (
            <img
              src={review.image_url}
              alt={review.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReviewCard;