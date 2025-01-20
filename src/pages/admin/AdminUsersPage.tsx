import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const AdminUsersPage = () => {
  return (
    <DashboardLayout>
      <Card className="shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add user management content here */}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminUsersPage;