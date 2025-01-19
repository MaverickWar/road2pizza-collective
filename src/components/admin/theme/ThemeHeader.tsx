import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ThemeSwitcher from "./ThemeSwitcher";

interface ThemeHeaderProps {
  showAdminThemes: boolean;
  onToggleAdminThemes: (checked: boolean) => void;
  onCreateTheme: () => void;
  onResetToDefault: () => void;
}

export function ThemeHeader({ 
  showAdminThemes, 
  onToggleAdminThemes,
  onCreateTheme,
  onResetToDefault 
}: ThemeHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Theme Settings</h1>
        <div className="flex items-center space-x-2">
          <Switch
            id="theme-type"
            checked={showAdminThemes}
            onCheckedChange={onToggleAdminThemes}
          />
          <Label htmlFor="theme-type">
            {showAdminThemes ? 'Admin Themes' : 'Site Themes'}
          </Label>
        </div>
        <ThemeSwitcher />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onResetToDefault}>
          Reset to Default
        </Button>
        <Button onClick={onCreateTheme}>
          Create New {showAdminThemes ? 'Admin' : 'Site'} Theme
        </Button>
      </div>
    </div>
  );
}