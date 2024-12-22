import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      color: "#000000",
      required_points: 0,
      is_special: false,
    }
  );
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Create a new File with processed image
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set desired dimensions (128x128 for badge icons)
      canvas.width = 128;
      canvas.height = 128;
      
      if (ctx) {
        // Draw image maintaining aspect ratio
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          x,
          y,
          img.width * scale,
          img.height * scale
        );
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      );

      const fileName = `${crypto.randomUUID()}.png`;
      const { data, error } = await supabase.storage
        .from('badge-images')
        .upload(fileName, blob, {
          contentType: 'image/png',
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('badge-images').getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Badge Image (128x128)</Label>
        <div className="flex items-center space-x-4">
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Badge preview"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <div className="flex space-x-2">
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
          />
          <div
            className="w-10 h-10 rounded border"
            style={{ backgroundColor: formData.color }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="required_points">Required Points</Label>
        <Input
          id="required_points"
          type="number"
          value={formData.required_points}
          onChange={(e) =>
            setFormData({
              ...formData,
              required_points: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_special"
          checked={formData.is_special}
          onChange={(e) =>
            setFormData({ ...formData, is_special: e.target.checked })
          }
        />
        <Label htmlFor="is_special">Special Badge</Label>
      </div>

      <Button
        className="w-full"
        onClick={() => onSubmit(formData)}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Save Badge"}
      </Button>
    </div>
  );
};

export default BadgeForm;