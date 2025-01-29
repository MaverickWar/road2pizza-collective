import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const SiteSettings = () => {
  const queryClient = useQueryClient();
  const [newAccessCode, setNewAccessCode] = useState("");
  const [expiryHours, setExpiryHours] = useState("24");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const toggleConstructionMode = async () => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ under_construction: !settings?.under_construction })
        .eq("id", settings?.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success(
        `Construction mode ${!settings?.under_construction ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.error("Error toggling construction mode:", error);
      toast.error("Failed to toggle construction mode");
    }
  };

  const toggleRegistration = async () => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ registration_enabled: !settings?.registration_enabled })
        .eq("id", settings?.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success(
        `Registration ${!settings?.registration_enabled ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.error("Error toggling registration:", error);
      toast.error("Failed to toggle registration");
    }
  };

  const generateAccessCode = async () => {
    if (!expiryHours || isNaN(Number(expiryHours)) || Number(expiryHours) <= 0) {
      toast.error("Please enter a valid expiry time");
      return;
    }

    setIsGenerating(true);
    try {
      const code = newAccessCode.trim() || Math.random().toString(36).substring(2, 10);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + Number(expiryHours));

      const { error } = await supabase
        .from("access_codes")
        .insert({ code, expires_at: expiresAt.toISOString() });

      if (error) throw error;

      toast.success("Access code generated successfully");
      setNewAccessCode("");
      setExpiryHours("24");
    } catch (error) {
      console.error("Error generating access code:", error);
      toast.error("Failed to generate access code");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Site Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Construction Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-medium">Construction Mode</h3>
              <p className="text-sm text-muted-foreground">
                Enable/disable site construction mode
              </p>
            </div>
            <Switch
              checked={settings?.under_construction}
              onCheckedChange={toggleConstructionMode}
            />
          </div>

          {/* Registration Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-medium">User Registration</h3>
              <p className="text-sm text-muted-foreground">
                Allow/disallow new user registrations
              </p>
            </div>
            <Switch
              checked={settings?.registration_enabled}
              onCheckedChange={toggleRegistration}
            />
          </div>

          {/* Access Code Generation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Generate Access Code</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Custom access code (optional)"
                  value={newAccessCode}
                  onChange={(e) => setNewAccessCode(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Expiry hours"
                  value={expiryHours}
                  onChange={(e) => setExpiryHours(e.target.value)}
                />
              </div>
              <Button
                onClick={generateAccessCode}
                disabled={isGenerating}
                className="w-full"
              >
                <Key className="w-4 h-4 mr-2" />
                Generate Access Code
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;