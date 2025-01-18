import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  theme: any;
  onUpdate: (colors: any) => void;
}

const ColorPicker = ({ theme, onUpdate }: ColorPickerProps) => {
  const colors = theme?.colors || {};

  const handleColorChange = (key: string, value: string) => {
    onUpdate({
      ...colors,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Primary Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={colors.primary || "#000000"}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={colors.primary || "#000000"}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Secondary Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={colors.secondary || "#000000"}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={colors.secondary || "#000000"}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Accent Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={colors.accent || "#000000"}
              onChange={(e) => handleColorChange("accent", e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={colors.accent || "#000000"}
              onChange={(e) => handleColorChange("accent", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={colors.background || "#FFFFFF"}
              onChange={(e) => handleColorChange("background", e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={colors.background || "#FFFFFF"}
              onChange={(e) => handleColorChange("background", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={colors.text || "#000000"}
              onChange={(e) => handleColorChange("text", e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={colors.text || "#000000"}
              onChange={(e) => handleColorChange("text", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;