import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar/SidebarContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import StatsCards from "@/components/admin/StatsCards";
import AdminHeader from "@/components/admin/AdminHeader";
import UserManagementTable from "@/components/admin/UserManagementTable";
import RecipeManagement from "@/components/recipe/RecipeManagement";
import ReviewManagement from "@/components/admin/ReviewManagement";
import BadgeManagement from "@/components/admin/rewards/BadgeManagement";
import PointRulesManagement from "@/components/admin/rewards/PointRulesManagement";
import PizzaTypeManagement from "@/pages/admin/PizzaTypeManagement";
import NotificationManagement from "@/pages/admin/NotificationManagement";
import SiteSettings from "@/pages/admin/SiteSettings";
import ThemeSettings from "@/pages/admin/ThemeSettings";
import MediaGallery from "@/pages/admin/MediaGallery";
import { toast } from "sonner";

function AdminDashboardOverview() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      console.log("Fetching admin statistics...");
      const [usersResponse, recipesResponse, reviewsResponse] = await Promise.all([
        supabase.from("profiles").select("count"),
        supabase.from("recipes").select("count"),
        supabase.from("reviews").select("rating"),
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (recipesResponse.error) throw recipesResponse.error;
      if (reviewsResponse.error) throw reviewsResponse.error;

      const averageRating = reviewsResponse.data.length
        ? reviewsResponse.data.reduce((acc, review) => acc + review.rating, 0) /
          reviewsResponse.data.length
        : 0;

      return {
        users: usersResponse.data[0]?.count || 0,
        recipes: recipesResponse.data[0]?.count || 0,
        reviews: reviewsResponse.data.length,
        averageRating,
      };
    },
  });

  if (loadingStats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-secondary/50 rounded-lg" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-secondary/50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader />
      {stats && <StatsCards stats={stats} />}
    </div>
  );
}

function AdminDashboard() {
  const handleToggleUserRole = async (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [`is_${role}`]: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      toast.success(`User ${role} status updated successfully`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleToggleSuspend = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      toast.success('User suspension status updated successfully');
    } catch (error) {
      console.error('Error updating user suspension:', error);
      toast.error('Failed to update user suspension status');
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <Routes>
            <Route index element={<AdminDashboardOverview />} />
            <Route 
              path="users" 
              element={
                <UserManagementTable 
                  users={[]} 
                  onToggleUserRole={handleToggleUserRole} 
                  onToggleSuspend={handleToggleSuspend} 
                />
              } 
            />
            <Route path="recipes" element={<RecipeManagement />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="rewards" element={
              <div className="grid gap-4 md:grid-cols-2">
                <BadgeManagement />
                <PointRulesManagement />
              </div>
            } />
            <Route path="pizza-types" element={<PizzaTypeManagement />} />
            <Route path="notifications" element={<NotificationManagement />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="theme" element={<ThemeSettings />} />
            <Route path="media" element={<MediaGallery />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AdminDashboard;