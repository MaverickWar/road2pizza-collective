import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface MenuSettingsProps {
  theme: any;
  onUpdate: (menuStyle: any) => void;
}

const MenuSettings = ({ theme, onUpdate }: MenuSettingsProps) => {
  const menuStyle = theme?.menu_style || {};

  const handleUpdate = (key: string, value: any) => {
    onUpdate({
      ...menuStyle,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Menu Type</Label>
          <Select
            value={menuStyle.type || "horizontal"}
            onValueChange={(value) => handleUpdate("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select menu type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="vertical">Vertical</SelectItem>
              <SelectItem value="dropdown">Dropdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Menu Position</Label>
          <Select
            value={menuStyle.position || "top"}
            onValueChange={(value) => handleUpdate("position", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select menu position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Item Spacing (px)</Label>
          <Input
            type="number"
            value={menuStyle.itemSpacing || 16}
            onChange={(e) => handleUpdate("itemSpacing", parseInt(e.target.value))}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Show Icons</Label>
          <Switch
            checked={menuStyle.showIcons || false}
            onCheckedChange={(checked) => handleUpdate("showIcons", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuSettings;