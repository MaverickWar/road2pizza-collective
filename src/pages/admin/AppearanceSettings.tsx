import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const AppearanceSettings = () => {
  const [primaryColor, setPrimaryColor] = useState("#E86565");
  const [secondaryColor, setSecondaryColor] = useState("#FFE4E7");
  const [accentColor, setAccentColor] = useState("#FEB088");

  const handleSave = () => {
    // TODO: Implement color saving logic
    toast.success("Appearance settings saved");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Appearance Settings</h1>
          <p className="text-muted-foreground">
            Customize the look and feel of your site
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Color Scheme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full md:w-auto">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AppearanceSettings;