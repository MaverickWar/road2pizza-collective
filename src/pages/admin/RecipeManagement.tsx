import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecipeManagement from "@/components/recipe/RecipeManagement";
import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen } from "lucide-react";

const RecipeManagementPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Recipe Management
          </h1>
        </div>
        <RecipeManagement />
      </div>
    </DashboardLayout>
  );
};

export default RecipeManagementPage;