import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { format } from "date-fns";
import { ReviewData } from "@/types/review";

interface ReviewHeaderProps {
  review: ReviewData;
}

export const ReviewHeader = ({ review }: ReviewHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {review.is_featured && (
          <Badge variant="secondary" className="bg-admin/10 text-admin">
            <Award className="w-4 h-4 mr-1" />
            Featured Review
          </Badge>
        )}
        <Badge variant="outline">{review.category}</Badge>
      </div>
      <h1 className="text-4xl font-bold">{review.title}</h1>
      <div className="flex items-center gap-4 text-muted-foreground">
        <span>By {review.profiles?.username || review.author}</span>
        <span>•</span>
        <span>{format(new Date(review.created_at), 'MMMM d, yyyy')}</span>
      </div>
    </div>
  );
};