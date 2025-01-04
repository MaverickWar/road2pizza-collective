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
  Settings,
  Star,
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
      return;
    }

    // Redirect admins to admin dashboard and staff to staff dashboard
    if (isAdmin) {
      navigate("/dashboard/admin");
      return;
    }
    if (isStaff) {
      navigate("/dashboard/staff");
      return;
    }
  }, [user, isAdmin, isStaff, navigate]);

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

  // Regular user dashboard
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/my-recipes">
            <Card className="p-6 hover:bg-accent/5 transition-colors cursor-pointer">
              <ChefHat className="w-8 h-8 mb-4 text-accent" />
              <h3 className="text-lg font-semibold mb-2">My Recipes</h3>
              <p className="text-gray-500">View and manage your recipes</p>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;