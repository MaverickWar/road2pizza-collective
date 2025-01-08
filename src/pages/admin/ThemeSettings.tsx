import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const ThemeSettings = () => {
  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Theme customization features coming soon...
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ThemeSettings;