import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ThemeSettings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Theme Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Brand Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input id="primary" type="color" className="w-20" />
                  <Input type="text" placeholder="#000000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input id="secondary" type="color" className="w-20" />
                  <Input type="text" placeholder="#000000" />
                </div>
              </div>
            </div>

            <Button>Save Theme</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ThemeSettings;