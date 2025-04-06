import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";
import RecipeSubmissionForm from "@/components/recipe/RecipeSubmissionForm";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChefHat } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    showRecipeForm?: boolean;
    categoryId?: string;
    categoryName?: string;
    returnTo?: string;
    recipeSubmitted?: boolean;
  };

  useEffect(() => {
    if (!user) {
      // Store the current location state in sessionStorage before redirecting to login
      if (state?.showRecipeForm) {
        sessionStorage.setItem('pendingRecipeSubmission', JSON.stringify(state));
      }
      toast.error("Please login to access the dashboard");
      navigate("/login", { state: { returnTo: "/dashboard" } });
      return;
    }

    // Check for pending recipe submission after login
    const pendingSubmission = sessionStorage.getItem('pendingRecipeSubmission');
    if (pendingSubmission) {
      const submissionState = JSON.parse(pendingSubmission);
      sessionStorage.removeItem('pendingRecipeSubmission');
      navigate('/dashboard', { state: submissionState, replace: true });
      return;
    }

    // Only redirect admins/staff if they're not trying to submit a recipe and haven't just submitted one
    if (!state?.showRecipeForm && !state?.recipeSubmitted) {
      if (isAdmin) {
        navigate("/dashboard/admin");
        return;
      }
      if (isStaff) {
        navigate("/dashboard/staff");
        return;
      }
    }
  }, [user, isAdmin, isStaff, navigate, state]);

  if (!user) return null;

  const handleRecipeSubmitted = () => {
    if (state?.returnTo) {
      navigate(state.returnTo);
    }
  };

  if (state?.showRecipeForm) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Submit Recipe for {state.categoryName}</h1>
          <RecipeSubmissionForm 
            pizzaTypeId={state.categoryId} 
            onSuccess={handleRecipeSubmitted}
          />
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