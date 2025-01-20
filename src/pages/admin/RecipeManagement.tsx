import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecipeManagement from "@/components/recipe/RecipeManagement";
import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen } from "lucide-react";

const RecipeManagementPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card className="shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <BookOpen className="w-5 h-5" />
              Recipe Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecipeManagement />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RecipeManagementPage;