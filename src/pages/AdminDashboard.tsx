import { useState } from "react";
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
import Editor from "@/components/Editor";
import {
  Ban,
  BookOpen,
  Eye,
  MessageSquare,
  Pencil,
  Star,
  User,
} from "lucide-react";

const AdminDashboard = () => {
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [content, setContent] = useState("");

  // Fetch recipes with their reviews
  const { data: recipes, isLoading: loadingRecipes } = useQuery({
    queryKey: ["admin-recipes"],
    queryFn: async () => {
      console.log("Fetching recipes with reviews...");
      const { data: recipesData, error: recipesError } = await supabase
        .from("recipes")
        .select(`
          *,
          reviews (
            id,
            rating,
            content,
            user_id,
            profiles (username)
          )
        `);
      
      if (recipesError) {
        console.error("Error fetching recipes:", recipesError);
        throw recipesError;
      }
      console.log("Fetched recipes:", recipesData);
      return recipesData;
    },
  });

  // Fetch users
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching users...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
      
      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      console.log("Fetched users:", data);
      return data;
    },
  });

  const handleToggleFeature = async (recipeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("recipes")
        .update({ is_featured: !currentStatus })
        .eq("id", recipeId);
      
      if (error) throw error;
      toast.success("Recipe feature status updated");
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe feature status");
    }
  };

  const handleToggleUserRole = async (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => {
    try {
      const updateField = role === 'admin' ? 'is_admin' : 'is_staff';
      const { error } = await supabase
        .from("profiles")
        .update({ [updateField]: !currentStatus })
        .eq("id", userId);
      
      if (error) throw error;
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
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="px-4 py-2 bg-secondary rounded-lg">
            <span className="text-sm font-medium">Admin Access</span>
          </div>
        </div>

        <Tabs defaultValue="recipes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recipes">
              <BookOpen className="w-4 h-4 mr-2" />
              Recipes & Reviews
            </TabsTrigger>
            <TabsTrigger value="users">
              <User className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Reviews</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipes?.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell>{recipe.title}</TableCell>
                        <TableCell>{recipe.author}</TableCell>
                        <TableCell>
                          {recipe.is_featured ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          {recipe.reviews?.length || 0} reviews
                          {recipe.reviews?.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              Avg: {(recipe.reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / recipe.reviews.length).toFixed(1)} ⭐
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFeature(recipe.id, recipe.is_featured)}
                          >
                            <Star className={`w-4 h-4 ${recipe.is_featured ? "text-yellow-500" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingRecipe(recipe)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell className="space-y-1">
                          {user.is_admin && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                              Admin
                            </span>
                          )}
                          {user.is_staff && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                              Staff
                            </span>
                          )}
                          {!user.is_admin && !user.is_staff && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                              Member
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                            user.is_suspended 
                              ? "bg-red-100 text-red-700" 
                              : "bg-green-100 text-green-700"
                          }`}>
                            {user.is_suspended ? "Suspended" : "Active"}
                          </span>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUserRole(user.id, 'admin', user.is_admin)}
                          >
                            {user.is_admin ? "Remove Admin" : "Make Admin"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleUserRole(user.id, 'staff', user.is_staff)}
                          >
                            {user.is_staff ? "Remove Staff" : "Make Staff"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleSuspend(user.id, user.is_suspended)}
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
        </Tabs>

        {editingRecipe && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Edit Recipe: {editingRecipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Editor content={content} onChange={setContent} />
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={() => setEditingRecipe(null)}>
                  Cancel
                </Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;