import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";
import RecipeSubmissionForm from "@/components/recipe/RecipeSubmissionForm";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ChefHat,
  Users,
  Settings,
  Star,
  MessageSquare,
  FileText,
  PenSquare,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { user, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    showRecipeForm?: boolean;
    categoryId?: string;
    categoryName?: string;
    recipeSubmitted?: boolean;
  };

  const { data: userRecipes } = useQuery({
    queryKey: ["user-recipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("created_by", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      toast.error("Please login to access the dashboard");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (state?.recipeSubmitted) {
      toast.success("Recipe submitted successfully! It will be reviewed by our team.");
    }
  }, [state?.recipeSubmitted]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {state?.showRecipeForm ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Submit Recipe for {state.categoryName}</h1>
            <RecipeSubmissionForm pizzaTypeId={state.categoryId} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isAdmin && (
                <>
                  <Link to="/dashboard/admin">
                    <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer">
                      <Settings className="w-8 h-8 mb-4 text-accent" />
                      <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
                      <p className="text-gray-500">Manage site settings and content</p>
                    </Card>
                  </Link>
                  <Link to="/dashboard/admin/users">
                    <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer">
                      <Users className="w-8 h-8 mb-4 text-accent" />
                      <h3 className="text-lg font-semibold mb-2">User Management</h3>
                      <p className="text-gray-500">Manage user roles and permissions</p>
                    </Card>
                  </Link>
                  <Link to="/dashboard/admin/forum">
                    <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer">
                      <MessageSquare className="w-8 h-8 mb-4 text-accent" />
                      <h3 className="text-lg font-semibold mb-2">Forum Management</h3>
                      <p className="text-gray-500">Manage forum categories and posts</p>
                    </Card>
                  </Link>
                </>
              )}
              
              {(isAdmin || isStaff) && (
                <>
                  <Link to="/dashboard/reviews">
                    <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer">
                      <Star className="w-8 h-8 mb-4 text-accent" />
                      <h3 className="text-lg font-semibold mb-2">Review Management</h3>
                      <p className="text-gray-500">Manage user reviews and ratings</p>
                    </Card>
                  </Link>
                  <Link to="/dashboard/staff">
                    <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer">
                      <ChefHat className="w-8 h-8 mb-4 text-accent" />
                      <h3 className="text-lg font-semibold mb-2">Staff Dashboard</h3>
                      <p className="text-gray-500">Access staff tools and features</p>
                    </Card>
                  </Link>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Recipes</h2>
                <Button onClick={() => navigate("/pizza")} className="bg-accent hover:bg-accent-hover text-white">
                  <PenSquare className="w-4 h-4 mr-2" />
                  Submit New Recipe
                </Button>
              </div>

              {userRecipes && userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map((recipe) => (
                    <Card 
                      key={recipe.id} 
                      className={cn(
                        "p-6",
                        recipe.approval_status === "pending" && "opacity-60"
                      )}
                    >
                      <FileText className="w-8 h-8 mb-4 text-accent" />
                      <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-muted-foreground">
                          Status: {recipe.status || "draft"}
                        </p>
                        {recipe.approval_status === "pending" && (
                          <div className="flex items-center text-sm text-yellow-500">
                            <Clock className="w-4 h-4 mr-1" />
                            Awaiting Approval
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/article/${recipe.id}`)}
                      >
                        View Recipe
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-500 mb-4">You haven't submitted any recipes yet.</p>
                  <Button onClick={() => navigate("/pizza")} className="bg-accent hover:bg-accent-hover text-white">
                    Submit Your First Recipe
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;