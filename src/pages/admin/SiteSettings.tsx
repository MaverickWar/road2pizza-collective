import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const SiteSettings = () => {
  return (
    <DashboardLayout>
      <Card className="shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Settings className="w-5 h-5" />
            Site Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Site settings configuration coming soon...
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SiteSettings;