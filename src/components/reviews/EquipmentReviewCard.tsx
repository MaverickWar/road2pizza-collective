import { Link } from "react-router-dom";
import { Star, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EquipmentReviewProps {
  review: {
    id: string;
    title: string;
    brand: string;
    model?: string;
    category: string;
    rating: number;
    image_url?: string;
    price_range?: string;
    durability_rating?: number;
    value_rating?: number;
    ease_of_use_rating?: number;
  };
}

const EquipmentReviewCard = ({ review }: EquipmentReviewProps) => {
  const averageRating = Math.round(
    ((review.rating || 0) +
      (review.durability_rating || 0) +
      (review.value_rating || 0) +
      (review.ease_of_use_rating || 0)) /
      4
  );

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg bg-card hover:bg-card-hover border-none shadow-md">
      <CardHeader className="p-0">
        {review.image_url ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={review.image_url}
              alt={review.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        ) : (
          <div className="h-48 bg-secondary/50 flex items-center justify-center">
            <Wrench className="w-12 h-12 text-accent/50" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/equipment/${review.id}`}
              className="text-lg font-semibold hover:text-accent transition-colors line-clamp-1"
            >
              {review.title}
            </Link>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{averageRating}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              {review.brand} {review.model}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-secondary/50">
                {review.category}
              </Badge>
              {review.price_range && (
                <Badge variant="outline" className="border-accent/20">
                  {review.price_range}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {review.durability_rating && (
              <div>
                <span className="text-gray-500">Durability:</span>{" "}
                {review.durability_rating}/5
              </div>
            )}
            {review.value_rating && (
              <div>
                <span className="text-gray-500">Value:</span>{" "}
                {review.value_rating}/5
              </div>
            )}
            {review.ease_of_use_rating && (
              <div>
                <span className="text-gray-500">Ease of Use:</span>{" "}
                {review.ease_of_use_rating}/5
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentReviewCard;