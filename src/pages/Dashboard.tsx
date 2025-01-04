import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";
import RecipeSubmissionForm from "@/components/recipe/RecipeSubmissionForm";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ChefHat,
  Users,
  Settings,
  Star,
  MessageSquare,
} from 'lucide-react';

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

  if (state?.showRecipeForm) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Submit Recipe for {state.categoryName}</h1>
          <RecipeSubmissionForm pizzaTypeId={state.categoryId} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Cards */}
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
          
          {/* Staff Cards */}
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

          {/* Regular User Card */}
          {!isAdmin && !isStaff && (
            <Link to="/my-recipes">
              <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer">
                <ChefHat className="w-8 h-8 mb-4 text-accent" />
                <h3 className="text-lg font-semibold mb-2">My Recipes</h3>
                <p className="text-gray-500">View and manage your recipes</p>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;