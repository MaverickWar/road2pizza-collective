import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Star, Filter } from "lucide-react";

interface ReviewStatsProps {
  totalReviews: number;
  averageRating: number;
  featuredReviews: number;
}

const ReviewStats = ({ totalReviews, averageRating, featuredReviews }: ReviewStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <ChefHat className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReviews}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Featured Reviews</CardTitle>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{featuredReviews}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStats;