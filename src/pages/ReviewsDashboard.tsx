import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star } from "lucide-react";
import ReviewManagement from "@/components/admin/ReviewManagement";
import ReviewsManagement from "@/components/reviews/ReviewsManagement";

const ReviewsDashboard = () => {
  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      console.log("Fetching reviews...");
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(username), recipes(title)");
      if (error) throw error;
      console.log("Fetched reviews:", data);
      return data;
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reviews Dashboard</h1>
        </div>

        <Tabs defaultValue="equipment" className="space-y-4">
          <TabsList>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Equipment Reviews
            </TabsTrigger>
            <TabsTrigger value="recipe" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Recipe Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Reviews Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipe">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Reviews Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewsManagement reviews={reviews || []} isLoading={loadingReviews} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReviewsDashboard;