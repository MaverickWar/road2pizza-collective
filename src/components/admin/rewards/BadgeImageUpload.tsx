import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BadgeImageUploadProps {
  imageUrl?: string;
  onImageUploaded: (url: string) => void;
}

const BadgeImageUpload = ({ imageUrl, onImageUploaded }: BadgeImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 128;
      canvas.height = 128;
      
      if (ctx) {
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }

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

      const { data: { publicUrl } } = supabase.storage
        .from('badge-images')
        .getPublicUrl(fileName);

      onImageUploaded(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Badge Image (128x128)</Label>
      <div className="flex items-center space-x-4">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Badge preview"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500 ring-offset-2"
          />
        )}
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default BadgeImageUpload;