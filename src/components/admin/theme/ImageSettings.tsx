import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ImageSettingsProps {
  theme: any;
  onUpdate: (images: any) => void;
}

const ImageSettings = ({ theme, onUpdate }: ImageSettingsProps) => {
  const images = theme?.images || {};

  const handleUpdate = (key: string, value: any) => {
    onUpdate({
      ...images,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Logo URL</Label>
          <Input
            type="text"
            value={images.logo || ""}
            onChange={(e) => handleUpdate("logo", e.target.value)}
            placeholder="Enter logo URL"
          />
        </div>

        <div className="space-y-2">
          <Label>Favicon URL</Label>
          <Input
            type="text"
            value={images.favicon || ""}
            onChange={(e) => handleUpdate("favicon", e.target.value)}
            placeholder="Enter favicon URL"
          />
        </div>

        <div className="space-y-2">
          <Label>Default Image Style</Label>
          <Select
            value={images.defaultStyle || "rounded"}
            onValueChange={(value) => handleUpdate("defaultStyle", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select image style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Image Border Radius (px)</Label>
          <Input
            type="number"
            value={images.borderRadius || 8}
            onChange={(e) => handleUpdate("borderRadius", parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageSettings;