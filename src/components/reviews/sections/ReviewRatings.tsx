import { Card } from "@/components/ui/card";
import { Rating } from "@/components/Rating";
import { Star, Wrench, DollarSign, Package } from "lucide-react";
import { ReviewData } from "@/types/review";

interface ReviewRatingsProps {
  review: ReviewData;
}

export const ReviewRatings = ({ review }: ReviewRatingsProps) => {
  const ratingCategories = [
    { label: "Overall", value: review.rating, icon: Star },
    { label: "Durability", value: review.durability_rating, icon: Wrench },
    { label: "Value", value: review.value_rating, icon: DollarSign },
    { label: "Ease of Use", value: review.ease_of_use_rating, icon: Package },
  ];

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-admin mb-2">{review.rating}/5</div>
        <Rating value={review.rating} className="justify-center" />
      </div>
      
      <div className="space-y-6">
        {ratingCategories.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-admin/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-admin" />
              </div>
              <span className="font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <Rating value={value || 0} />
              <span className="font-bold text-admin">{value}/5</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};