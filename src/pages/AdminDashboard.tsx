import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  Star, 
  Award, 
  LayoutDashboard, 
  FileText,
  Settings,
  Bell,
  Palette,
  Image
} from 'lucide-react';
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
import PizzaTypeManagement from "@/pages/admin/PizzaTypeManagement";
import NotificationManagement from "@/pages/admin/NotificationManagement";
import SiteSettings from "@/pages/admin/SiteSettings";
import ThemeSettings from "@/pages/admin/ThemeSettings";
import MediaGallery from "@/pages/admin/MediaGallery";

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
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
            <TabsTrigger value="overview" className="w-full">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="recipes" className="w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Recipes
            </TabsTrigger>
            <TabsTrigger value="reviews" className="w-full">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="rewards" className="w-full">
              <Award className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="pizza" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Pizza Types
            </TabsTrigger>
            <TabsTrigger value="notifications" className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="theme" className="w-full">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="media" className="w-full">
              <Image className="w-4 h-4 mr-2" />
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecipeApprovalSection />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserManagementTable
                    users={users?.slice(0, 5) || []}
                    onToggleUserRole={handleToggleUserRole}
                    onToggleSuspend={handleToggleSuspend}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Page Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <PageManagement />
                </CardContent>
              </Card>
            </div>
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

          <TabsContent value="recipes">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Management</CardTitle>
              </CardHeader>
              <CardContent>
                <RecipeManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Review Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <div className="grid gap-4 md:grid-cols-2">
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
                  <CardTitle>Point Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <PointRulesManagement />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pizza">
            <Card>
              <CardHeader>
                <CardTitle>Pizza Type Management</CardTitle>
              </CardHeader>
              <CardContent>
                <PizzaTypeManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Management</CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <SiteSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <ThemeSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaGallery />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;