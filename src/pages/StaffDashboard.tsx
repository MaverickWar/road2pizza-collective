import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Ban, BookOpen, Eye, MessageSquare, User } from "lucide-react";
import RecipeManagement from "@/components/recipe/RecipeManagement";

const StaffDashboard = () => {
  // Fetch users
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
      if (error) throw error;
      console.log("Fetched users:", data);
      return data;
    },
  });

  // Fetch reviews
  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      console.log("Fetching reviews...");
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(is_admin), recipes(title)");
      if (error) throw error;
      console.log("Fetched reviews:", data);
      return data;
    },
  });

  const handleToggleSuspend = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: !currentStatus })
        .eq("id", userId);
      
      if (error) throw error;
      toast.success("User suspension status updated");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user suspension status");
    }
  };

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
            <TabsTrigger value="users">
              <User className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            <RecipeManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          {user.is_admin 
                            ? "Admin" 
                            : user.is_staff 
                              ? "Staff" 
                              : "Member"}
                        </TableCell>
                        <TableCell>
                          {user.is_suspended ? "Suspended" : "Active"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleSuspend(user.id, user.is_suspended)}
                            disabled={user.is_admin}
                          >
                            {user.is_suspended ? (
                              <Eye className="w-4 h-4 mr-2" />
                            ) : (
                              <Ban className="w-4 h-4 mr-2" />
                            )}
                            {user.is_suspended ? "Activate" : "Suspend"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reviews Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipe</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews?.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>{review.recipes?.title}</TableCell>
                        <TableCell>{review.rating}/5</TableCell>
                        <TableCell className="max-w-md truncate">
                          {review.content}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={review.profiles?.is_admin}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;