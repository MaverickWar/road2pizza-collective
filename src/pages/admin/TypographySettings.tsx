import AdminLayout from "@/components/admin/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const TypographySettings = () => {
  const [primaryFont, setPrimaryFont] = useState("Inter");
  const [headingFont, setHeadingFont] = useState("Inter");
  const [baseSize, setBaseSize] = useState("16");

  const handleSave = () => {
    // TODO: Implement typography saving logic
    toast.success("Typography settings saved");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Typography Settings</h1>
          <p className="text-muted-foreground">
            Customize the typography of your site
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Font Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryFont">Primary Font</Label>
                <Select value={primaryFont} onValueChange={setPrimaryFont}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headingFont">Heading Font</Label>
                <Select value={headingFont} onValueChange={setHeadingFont}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseSize">Base Font Size (px)</Label>
              <Input
                id="baseSize"
                type="number"
                value={baseSize}
                onChange={(e) => setBaseSize(e.target.value)}
                min="12"
                max="24"
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

export default TypographySettings;