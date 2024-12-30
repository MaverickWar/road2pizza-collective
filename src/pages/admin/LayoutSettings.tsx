import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const LayoutSettings = () => {
  const [sidebarEnabled, setSidebarEnabled] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);
  const [stickyHeader, setStickyHeader] = useState(true);

  const handleSave = () => {
    // TODO: Implement layout saving logic
    toast.success("Layout settings saved");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Layout Settings</h1>
          <p className="text-muted-foreground">
            Customize the layout of your site
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Layout Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sidebar">Sidebar Navigation</Label>
                <p className="text-sm text-muted-foreground">
                  Enable sidebar navigation on desktop
                </p>
              </div>
              <Switch
                id="sidebar"
                checked={sidebarEnabled}
                onCheckedChange={setSidebarEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="fullWidth">Full Width Layout</Label>
                <p className="text-sm text-muted-foreground">
                  Use full width layout on all pages
                </p>
              </div>
              <Switch
                id="fullWidth"
                checked={fullWidth}
                onCheckedChange={setFullWidth}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="stickyHeader">Sticky Header</Label>
                <p className="text-sm text-muted-foreground">
                  Keep header fixed at top while scrolling
                </p>
              </div>
              <Switch
                id="stickyHeader"
                checked={stickyHeader}
                onCheckedChange={setStickyHeader}
              />
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

export default LayoutSettings;