import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";

interface ReviewStatsProps {
  reviews: any[];
}

const ReviewStats = ({ reviews }: ReviewStatsProps) => {
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
    <div className="flex gap-4 flex-wrap">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="flex items-center space-x-4 p-4">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewStats;