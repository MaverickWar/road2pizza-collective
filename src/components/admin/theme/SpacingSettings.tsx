import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface SpacingSettingsProps {
  theme: any;
  onUpdate: (spacing: any) => void;
}

const SpacingSettings = ({ theme, onUpdate }: SpacingSettingsProps) => {
  const spacing = theme?.spacing || {};

  const handleUpdate = (key: string, value: any) => {
    onUpdate({
      ...spacing,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Base Spacing Unit (px)</Label>
          <Input
            type="number"
            value={spacing.baseUnit || 4}
            onChange={(e) => handleUpdate("baseUnit", parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Container Padding (px)</Label>
          <Input
            type="number"
            value={spacing.containerPadding || 16}
            onChange={(e) => handleUpdate("containerPadding", parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Section Spacing (px)</Label>
          <Input
            type="number"
            value={spacing.sectionSpacing || 64}
            onChange={(e) => handleUpdate("sectionSpacing", parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Grid Gap (px)</Label>
          <Input
            type="number"
            value={spacing.gridGap || 16}
            onChange={(e) => handleUpdate("gridGap", parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default SpacingSettings;