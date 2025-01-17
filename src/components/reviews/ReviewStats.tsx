import { Card } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp, TrendingUp, Users, Award } from "lucide-react";
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
      label: "Total Reviews",
      value: reviews.length,
      icon: MessageSquare,
      color: "text-blue-500",
      trend: "+12% this month",
    },
    {
      label: "Avg Rating",
      value: averageRating.toFixed(1),
      icon: Star,
      color: "text-yellow-500",
      trend: "4.8 last month",
    },
    {
      label: "Active Users",
      value: "2.4k",
      icon: Users,
      color: "text-green-500",
      trend: "+18% increase",
    },
    {
      label: "Featured",
      value: reviews.filter(r => r.is_featured).length,
      icon: Award,
      color: "text-purple-500",
      trend: "Top performers",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  {stat.trend}
                </p>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <NewReviewButton onClick={onNewReview} />
      </div>
    </div>
  );
};

export default ReviewStats;