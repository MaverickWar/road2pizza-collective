import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Palette, Type, Layout, Image, Menu, Sparkles, Settings } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import ColorPicker from "@/components/admin/theme/ColorPicker";
import TypographySettings from "@/components/admin/theme/TypographySettings";
import SpacingSettings from "@/components/admin/theme/SpacingSettings";
import ImageSettings from "@/components/admin/theme/ImageSettings";
import MenuSettings from "@/components/admin/theme/MenuSettings";
import AnimationSettings from "@/components/admin/theme/AnimationSettings";
import { useTheme } from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/admin/theme/ThemeSwitcher";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ThemeSettings = () => {
  const queryClient = useQueryClient();
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [showAdminThemes, setShowAdminThemes] = useState(false);
  const { setTheme, resetToDefault } = useTheme();

  const { data: themes, isLoading } = useQuery({
    queryKey: ["theme-settings", showAdminThemes],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .eq("is_admin_theme", showAdminThemes)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createThemeMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("theme_settings")
        .insert([{ 
          name,
          is_admin_theme: showAdminThemes,
          colors: showAdminThemes ? {
            admin: {
              DEFAULT: "249 115 22",
              secondary: "234 88 12",
              accent: "249 115 22",
              muted: "120 113 108",
              background: "249 250 251",
              foreground: "41 37 36",
              border: "229 231 235",
              hover: {
                DEFAULT: "234 88 12",
                secondary: "217 70 0"
              }
            }
          } : {}
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme-settings"] });
      toast.success("Theme created successfully");
    },
    onError: (error) => {
      console.error("Error creating theme:", error);
      toast.error("Failed to create theme");
    },
  });

  const updateThemeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("theme_settings")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme-settings"] });
      toast.success("Theme updated successfully");
    },
    onError: (error) => {
      console.error("Error updating theme:", error);
      toast.error("Failed to update theme");
    },
  });

  const handleCreateTheme = async () => {
    const name = prompt(`Enter ${showAdminThemes ? 'admin' : ''} theme name:`);
    if (name) {
      await createThemeMutation.mutateAsync(name);
    }
  };

  const handleActivateTheme = async (themeId: string) => {
    try {
      await supabase
        .from("theme_settings")
        .update({ is_active: false })
        .eq("is_admin_theme", showAdminThemes);

      await supabase
        .from("theme_settings")
        .update({ is_active: true })
        .eq("id", themeId);

      await setTheme(themeId);
      queryClient.invalidateQueries({ queryKey: ["theme-settings"] });
      toast.success("Theme activated successfully");
    } catch (error) {
      console.error("Error activating theme:", error);
      toast.error("Failed to activate theme");
    }
  };

  const handleResetToDefault = async () => {
    try {
      await resetToDefault();
      queryClient.invalidateQueries({ queryKey: ["theme-settings"] });
      toast.success("Reset to default theme");
    } catch (error) {
      console.error("Error resetting theme:", error);
      toast.error("Failed to reset theme");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Theme Settings</h1>
            <div className="flex items-center space-x-2">
              <Switch
                id="theme-type"
                checked={showAdminThemes}
                onCheckedChange={setShowAdminThemes}
              />
              <Label htmlFor="theme-type">
                {showAdminThemes ? 'Admin Themes' : 'Site Themes'}
              </Label>
            </div>
            <ThemeSwitcher />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetToDefault}>
              Reset to Default
            </Button>
            <Button onClick={handleCreateTheme}>
              Create New {showAdminThemes ? 'Admin' : 'Site'} Theme
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes?.map((theme) => (
            <Card key={theme.id} className={theme.is_active ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{theme.name}</span>
                  {!theme.is_active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActivateTheme(theme.id)}
                    >
                      Activate
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setActiveTheme(theme.id)}
                >
                  Edit Theme
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {activeTheme && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Edit Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="colors">
                <TabsList className="grid grid-cols-7 w-full">
                  <TabsTrigger value="colors">
                    <Palette className="w-4 h-4 mr-2" />
                    Colors
                  </TabsTrigger>
                  <TabsTrigger value="typography">
                    <Type className="w-4 h-4 mr-2" />
                    Typography
                  </TabsTrigger>
                  <TabsTrigger value="spacing">
                    <Layout className="w-4 h-4 mr-2" />
                    Spacing
                  </TabsTrigger>
                  <TabsTrigger value="images">
                    <Image className="w-4 h-4 mr-2" />
                    Images
                  </TabsTrigger>
                  <TabsTrigger value="menu">
                    <Menu className="w-4 h-4 mr-2" />
                    Menu
                  </TabsTrigger>
                  <TabsTrigger value="animations">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Animations
                  </TabsTrigger>
                  {showAdminThemes && (
                    <TabsTrigger value="admin">
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="colors">
                  <ColorPicker
                    theme={themes?.find((t) => t.id === activeTheme)}
                    onUpdate={(colors) =>
                      updateThemeMutation.mutate({
                        id: activeTheme,
                        updates: { colors },
                      })
                    }
                  />
                </TabsContent>

                <TabsContent value="typography">
                  <TypographySettings
                    theme={themes?.find((t) => t.id === activeTheme)}
                    onUpdate={(typography) =>
                      updateThemeMutation.mutate({
                        id: activeTheme,
                        updates: { typography },
                      })
                    }
                  />
                </TabsContent>

                <TabsContent value="spacing">
                  <SpacingSettings
                    theme={themes?.find((t) => t.id === activeTheme)}
                    onUpdate={(spacing) =>
                      updateThemeMutation.mutate({
                        id: activeTheme,
                        updates: { spacing },
                      })
                    }
                  />
                </TabsContent>

                <TabsContent value="images">
                  <ImageSettings
                    theme={themes?.find((t) => t.id === activeTheme)}
                    onUpdate={(images) =>
                      updateThemeMutation.mutate({
                        id: activeTheme,
                        updates: { images },
                      })
                    }
                  />
                </TabsContent>

                <TabsContent value="menu">
                  <MenuSettings
                    theme={themes?.find((t) => t.id === activeTheme)}
                    onUpdate={(menuStyle) =>
                      updateThemeMutation.mutate({
                        id: activeTheme,
                        updates: { menu_style: menuStyle },
                      })
                    }
                  />
                </TabsContent>

                <TabsContent value="animations">
                  <AnimationSettings
                    theme={themes?.find((t) => t.id === activeTheme)}
                    onUpdate={(animations) =>
                      updateThemeMutation.mutate({
                        id: activeTheme,
                        updates: { animations },
                      })
                    }
                  />
                </TabsContent>

                {showAdminThemes && (
                  <TabsContent value="admin">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Admin Colors</h3>
                        <ColorPicker
                          theme={{ colors: themes?.find((t) => t.id === activeTheme)?.admin_colors?.admin }}
                          onUpdate={(colors) =>
                            updateThemeMutation.mutate({
                              id: activeTheme,
                              updates: { admin_colors: { admin: colors } },
                            })
                          }
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Admin Menu</h3>
                        <MenuSettings
                          theme={{ menu_style: themes?.find((t) => t.id === activeTheme)?.admin_menu }}
                          onUpdate={(menuStyle) =>
                            updateThemeMutation.mutate({
                              id: activeTheme,
                              updates: { admin_menu: menuStyle },
                            })
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ThemeSettings;
