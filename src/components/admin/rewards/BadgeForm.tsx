import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import BadgeImageUpload from "./BadgeImageUpload";
import BadgePreview from "./BadgePreview";
import { Crown, Star } from "lucide-react";

interface BadgeFormData {
  title: string;
  description: string;
  color: string;
  required_points: number;
  is_special: boolean;
  image_url?: string;
}

interface BadgeFormProps {
  onSubmit: (data: BadgeFormData) => void;
  initialData?: BadgeFormData;
}

const BadgeForm = ({ onSubmit, initialData }: BadgeFormProps) => {
  const [formData, setFormData] = useState<BadgeFormData>(
    initialData || {
      title: "",
      description: "",
      color: "#9b87f5",
      required_points: 0,
      is_special: false,
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BadgePreview
          title={formData.title}
          color={formData.color}
          isSpecial={formData.is_special}
          imageUrl={formData.image_url}
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="is_special"
            checked={formData.is_special}
            onCheckedChange={(checked) => setFormData({ ...formData, is_special: checked })}
          />
          <Label htmlFor="is_special" className="flex items-center space-x-2">
            {formData.is_special ? (
              <Crown className="h-4 w-4 text-primary" />
            ) : (
              <Star className="h-4 w-4 text-muted-foreground" />
            )}
            <span>Special Badge</span>
          </Label>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter badge title"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter badge description"
            className="w-full"
          />
        </div>

        <BadgeImageUpload
          imageUrl={formData.image_url}
          onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
        />

        <div className="space-y-2">
          <Label htmlFor="color">Badge Color</Label>
          <div className="flex space-x-2">
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-24"
            />
            <div
              className="w-10 h-10 rounded-full ring-2 ring-offset-2 transition-colors"
              style={{ backgroundColor: formData.color, borderColor: formData.color }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="required_points">Required Points</Label>
          <Input
            id="required_points"
            type="number"
            value={formData.required_points}
            onChange={(e) => setFormData({
              ...formData,
              required_points: parseInt(e.target.value) || 0,
            })}
            className="w-full"
          />
        </div>

        <Button
          onClick={() => onSubmit(formData)}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
        >
          Save Badge
        </Button>
      </div>
    </div>
  );
};

export default BadgeForm;