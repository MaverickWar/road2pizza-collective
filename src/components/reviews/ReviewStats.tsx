import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import NewReviewButton from "./NewReviewButton";

interface ReviewStatsProps {
  reviews: any[];
  onNewReview: () => void;
}

const ReviewStats = ({ reviews, onNewReview }: ReviewStatsProps) => {
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;

  const stats = [
    {
      label: "Reviews",
      value: reviews.length,
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      label: "Avg Rating",
      value: averageRating.toFixed(1),
      icon: Star,
      color: "text-yellow-500",
    },
    {
      label: "Engagement",
      value: "95%",
      icon: ThumbsUp,
      color: "text-green-500",
    },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-2 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                  <p className="text-sm sm:text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center md:justify-start">
        <NewReviewButton onClick={onNewReview} />
      </div>
    </div>
  );
};

export default ReviewStats;