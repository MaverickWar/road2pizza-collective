import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AnimationSettingsProps {
  theme: any;
  onUpdate: (animations: any) => void;
}

const AnimationSettings = ({ theme, onUpdate }: AnimationSettingsProps) => {
  const animations = theme?.animations || {};

  const handleUpdate = (key: string, value: any) => {
    onUpdate({
      ...animations,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Page Transition</Label>
          <Select
            value={animations.pageTransition || "fade"}
            onValueChange={(value) => handleUpdate("pageTransition", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transition type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fade">Fade</SelectItem>
              <SelectItem value="slide">Slide</SelectItem>
              <SelectItem value="scale">Scale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Transition Duration (ms)</Label>
          <Input
            type="number"
            value={animations.duration || 300}
            onChange={(e) => handleUpdate("duration", parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label>Hover Effect</Label>
          <Select
            value={animations.hoverEffect || "scale"}
            onValueChange={(value) => handleUpdate("hoverEffect", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select hover effect" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scale">Scale</SelectItem>
              <SelectItem value="glow">Glow</SelectItem>
              <SelectItem value="lift">Lift</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label>Enable Animations</Label>
          <Switch
            checked={animations.enabled || false}
            onCheckedChange={(checked) => handleUpdate("enabled", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimationSettings;