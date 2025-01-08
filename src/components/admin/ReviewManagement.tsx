import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import ReviewTable from "./reviews/ReviewTable";
import ReviewStats from "./reviews/ReviewStats";
import ReviewFilters from "./reviews/ReviewFilters";

const ReviewManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6" />
            Review Management
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Review Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewStats />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewFilters />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewTable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewManagement;