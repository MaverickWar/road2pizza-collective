import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BookOpen, Users, Star, Award } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import UserManagementTable from "@/components/admin/UserManagementTable";
import RecipeManagement from "@/components/recipe/RecipeManagement";
import ReviewManagement from "@/components/admin/ReviewManagement";
import BadgeManagement from "@/components/admin/rewards/BadgeManagement";
import PointRulesManagement from "@/components/admin/rewards/PointRulesManagement";

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  // Fetch all necessary data
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

        <Tabs defaultValue="recipes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="recipes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Recipes & Reviews
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="equipment-reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Equipment Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            <RecipeManagement />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagementTable
                  users={users || []}
                  onToggleUserRole={handleToggleUserRole}
                  onToggleSuspend={handleToggleSuspend}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Badge Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <BadgeManagement />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Point Rules Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <PointRulesManagement />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment-reviews">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Reviews Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;