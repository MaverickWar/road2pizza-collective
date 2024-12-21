import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageSquare } from "lucide-react";
import RecipeManagement from "@/components/recipe/RecipeManagement";
import ReviewsManagement from "@/components/reviews/ReviewsManagement";

const StaffDashboard = () => {
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
          <h1 className="text-2xl font-bold">Staff Dashboard</h1>
          <div className="px-4 py-2 bg-secondary rounded-lg">
            <span className="text-sm font-medium">Staff Access</span>
          </div>
        </div>

        <Tabs defaultValue="recipes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recipes">
              <BookOpen className="w-4 h-4 mr-2" />
              Recipes
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            <RecipeManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Reviews Management</CardTitle>
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

export default StaffDashboard;