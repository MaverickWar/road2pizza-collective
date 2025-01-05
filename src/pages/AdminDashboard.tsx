import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/admin/StatsCards";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      console.log("Fetching admin stats...");
      
      const [usersResponse, recipesResponse, reviewsCountResponse, avgRatingResponse] = await Promise.all([
        supabase.from('profiles').select('count'),
        supabase.from('recipes').select('count'),
        supabase.from('reviews').select('count'),
        supabase.from('reviews').select('rating').not('rating', 'is', null)
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (recipesResponse.error) throw recipesResponse.error;
      if (reviewsCountResponse.error) throw reviewsCountResponse.error;
      if (avgRatingResponse.error) throw avgRatingResponse.error;

      // Calculate average rating manually from the raw ratings
      const ratings = avgRatingResponse.data.map(r => r.rating || 0);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length 
        : 0;

      return {
        users: usersResponse.data[0]?.count || 0,
        recipes: recipesResponse.data[0]?.count || 0,
        reviews: reviewsCountResponse.data[0]?.count || 0,
        averageRating: averageRating
      };
    }
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>

        <StatsCards stats={stats || { users: 0, recipes: 0, reviews: 0, averageRating: 0 }} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;