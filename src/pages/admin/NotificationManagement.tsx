import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const NotificationManagement = () => {
  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Notification management features coming soon...
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default NotificationManagement;