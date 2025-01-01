import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Star, Award, LayoutDashboard, FileText } from 'lucide-react';
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import UserManagementTable from "@/components/admin/UserManagementTable";
import RecipeManagement from "@/components/recipe/RecipeManagement";
import RecipeApprovalSection from "@/components/admin/recipe/RecipeApprovalSection";
import ReviewManagement from "@/components/admin/ReviewManagement";
import BadgeManagement from "@/components/admin/rewards/BadgeManagement";
import PointRulesManagement from "@/components/admin/rewards/PointRulesManagement";
import PageManagement from "@/components/admin/pages/PageManagement";

const AdminDashboard = () => {
  const queryClient = useQueryClient();

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

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching users...");
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleToggleUserRole = async (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => {
    try {
      const updateField = role === 'admin' ? 'is_admin' : 'is_staff';
      const { error } = await supabase
        .from("profiles")
        .update({ [updateField]: !currentStatus })
        .eq("id", userId);
      
      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      
      toast.success(`User ${role} status updated`);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(`Failed to update user ${role} status`);
    }
  };

  const handleToggleSuspend = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: !currentStatus })
        .eq("id", userId);
      
      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User suspension status updated");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user suspension status");
    }
  };

  if (loadingStats || loadingUsers) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-20 bg-secondary/50 rounded-lg" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-secondary/50 rounded-lg" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AdminHeader />
        {stats && <StatsCards stats={stats} />}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="recipes">
              <BookOpen className="w-4 h-4 mr-2" />
              Recipes
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <RecipeApprovalSection />
              <UserManagementTable
                users={users || []}
                onToggleUserRole={handleToggleUserRole}
                onToggleSuspend={handleToggleSuspend}
              />
            </div>
          </TabsContent>

          <TabsContent value="recipes">
            <RecipeManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementTable
              users={users || []}
              onToggleUserRole={handleToggleUserRole}
              onToggleSuspend={handleToggleSuspend}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
