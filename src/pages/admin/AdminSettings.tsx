import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const AdminSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [cacheTimeout, setCacheTimeout] = useState("3600");

  const handleSave = () => {
    // TODO: Implement settings saving logic
    toast.success("Admin settings saved");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure global admin settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Put site in maintenance mode
                </p>
              </div>
              <Switch
                id="maintenance"
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debug">Debug Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable detailed error logging
                </p>
              </div>
              <Switch
                id="debug"
                checked={debugMode}
                onCheckedChange={setDebugMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cacheTimeout">Cache Timeout (seconds)</Label>
              <Input
                id="cacheTimeout"
                type="number"
                value={cacheTimeout}
                onChange={(e) => setCacheTimeout(e.target.value)}
                min="0"
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

export default AdminSettings;