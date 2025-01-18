import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypographySettingsProps {
  theme: any;
  onUpdate: (typography: any) => void;
}

const TypographySettings = ({ theme, onUpdate }: TypographySettingsProps) => {
  const typography = theme?.typography || {};

  const handleUpdate = (key: string, value: any) => {
    onUpdate({
      ...typography,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Primary Font</Label>
          <Select
            value={typography.primaryFont || "sans"}
            onValueChange={(value) => handleUpdate("primaryFont", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Base Font Size (px)</Label>
          <Input
            type="number"
            value={typography.baseFontSize || 16}
            onChange={(e) => handleUpdate("baseFontSize", parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Heading Scale</Label>
          <Input
            type="number"
            step="0.1"
            value={typography.headingScale || 1.2}
            onChange={(e) => handleUpdate("headingScale", parseFloat(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Line Height</Label>
          <Input
            type="number"
            step="0.1"
            value={typography.lineHeight || 1.5}
            onChange={(e) => handleUpdate("lineHeight", parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default TypographySettings;