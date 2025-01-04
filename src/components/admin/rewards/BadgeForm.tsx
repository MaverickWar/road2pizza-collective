import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BadgeImageUpload from "./BadgeImageUpload";
import BadgePreview from "./BadgePreview";

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
      <BadgePreview
        title={formData.title}
        color={formData.color}
        isSpecial={formData.is_special}
        imageUrl={formData.image_url}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              style={{ backgroundColor: formData.color, ringColor: formData.color }}
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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_special"
            checked={formData.is_special}
            onChange={(e) => setFormData({ ...formData, is_special: e.target.checked })}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <Label htmlFor="is_special">Special Badge</Label>
        </div>

        <Button
          onClick={() => onSubmit(formData)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          Save Badge
        </Button>
      </div>
    </div>
  );
};

export default BadgeForm;