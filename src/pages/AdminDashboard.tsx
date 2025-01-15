import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/admin/StatsCards";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminDashboard = () => {
  const { user } = useAuth();

  console.log("Rendering AdminDashboard, user:", user);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      console.log("Fetching admin stats...");
      
      // Fetch all stats in parallel for better performance
      const [
        usersResponse, 
        recipesResponse, 
        reviewsResponse,
        equipmentReviewsResponse
      ] = await Promise.all([
        // Get total users count
        supabase.from('profiles').select('count'),
        
        // Get published and approved recipes count
        supabase
          .from('recipes')
          .select('count')
          .eq('status', 'published')
          .eq('approval_status', 'approved'),
        
        // Get all recipe reviews
        supabase
          .from('reviews')
          .select('rating'),

        // Get all equipment reviews
        supabase
          .from('equipment_reviews')
          .select('rating')
          .not('rating', 'is', null)
      ]);

      console.log("Stats responses:", {
        users: usersResponse,
        recipes: recipesResponse,
        reviews: reviewsResponse,
        equipmentReviews: equipmentReviewsResponse
      });

      if (usersResponse.error) throw usersResponse.error;
      if (recipesResponse.error) throw recipesResponse.error;
      if (reviewsResponse.error) throw reviewsResponse.error;
      if (equipmentReviewsResponse.error) throw equipmentReviewsResponse.error;

      // Calculate total reviews and average rating
      const recipeReviews = reviewsResponse.data || [];
      const equipmentReviews = equipmentReviewsResponse.data || [];
      
      const totalReviews = recipeReviews.length + equipmentReviews.length;
      
      // Calculate average rating across both review types
      const totalRatingSum = recipeReviews.reduce((acc, review) => acc + (review.rating || 0), 0) +
                            equipmentReviews.reduce((acc, review) => acc + (review.rating || 0), 0);
      
      const averageRating = totalReviews > 0 ? totalRatingSum / totalReviews : 0;

      return {
        users: usersResponse.data[0]?.count || 0,
        recipes: recipesResponse.data[0]?.count || 0,
        reviews: totalReviews,
        averageRating: averageRating
      };
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[400px]">
          <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    console.error("Error loading admin stats:", error);
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load admin dashboard stats. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-2 mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.username || user?.email}
          </p>
        </div>

        <StatsCards stats={stats || { users: 0, recipes: 0, reviews: 0, averageRating: 0 }} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;