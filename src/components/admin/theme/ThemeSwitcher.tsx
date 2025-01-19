import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette } from "lucide-react";
import { toast } from "sonner";

const ThemeSwitcher = () => {
  const { setTheme, currentTheme } = useTheme();

  const { data: themes } = useQuery({
    queryKey: ["theme-settings"],
    queryFn: async () => {
      console.log("Fetching available themes...");
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching themes:", error);
        throw error;
      }
      return data;
    },
  });

  const handleThemeChange = async (themeId: string) => {
    try {
      await setTheme(themeId);
      toast.success("Theme updated successfully");
    } catch (error) {
      console.error("Error changing theme:", error);
      toast.error("Failed to update theme");
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <Palette className="h-4 w-4 text-admin-muted" />
      <Select
        value={currentTheme?.id}
        onValueChange={handleThemeChange}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {themes?.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              {theme.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSwitcher;