import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Key } from "lucide-react";

export const SiteSettingsForm = () => {
  const [newAccessCode, setNewAccessCode] = useState("");
  const [expiryHours, setExpiryHours] = useState("24");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    under_construction: false,
    registration_enabled: true
  });

  const toggleConstructionMode = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("site_settings")
        .update({ under_construction: !settings.under_construction })
        .eq("id", "1"); // Convert number to string here

      if (error) throw error;

      setSettings(prev => ({
        ...prev,
        under_construction: !prev.under_construction
      }));

      toast.success(
        `Construction mode ${!settings.under_construction ? "enabled" : "disabled"}`
      );
    } catch (error) {
      console.error("Error toggling construction mode:", error);
      toast.error("Failed to toggle construction mode");
    } finally {
      setIsLoading(false);
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

      toast.success(`Access code generated: ${code}`);
      setNewAccessCode("");
      setExpiryHours("24");
    } catch (error) {
      console.error("Error generating access code:", error);
      toast.error("Failed to generate access code");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Site Settings
          </CardTitle>
          <CardDescription>
            Manage your site's construction mode and access settings
          </CardDescription>
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
              checked={settings.under_construction}
              onCheckedChange={toggleConstructionMode}
              disabled={isLoading}
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