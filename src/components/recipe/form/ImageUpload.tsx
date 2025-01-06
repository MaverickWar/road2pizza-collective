import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string | null;
  disabled?: boolean;
}

const ImageUpload = ({ onImageUploaded, currentImageUrl, disabled }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || '');
  const { user } = useAuth();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!user) {
        toast.error('Please login to upload images');
        return;
      }

      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      console.log('Starting upload with auth:', !!user);

      // Optimize file size before upload if it's an image
      if (file.type.startsWith('image/')) {
        const optimizedFile = await optimizeImage(file);
        await uploadFile(optimizedFile || file);
      } else {
        await uploadFile(file);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
      if (event.target) event.target.value = '';
    }
  };

  const optimizeImage = async (file: File): Promise<File | null> => {
    try {
      // Only optimize if file is larger than 1MB
      if (file.size <= 1024 * 1024) return file;

      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = URL.createObjectURL(file);
      });

      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      const maxDimension = 1920;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to blob with reduced quality
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
      );

      return new File([blob], file.name, { type: 'image/jpeg' });
    } catch (error) {
      console.error('Error optimizing image:', error);
      return null;
    }
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully:', publicUrl);
    onImageUploaded(publicUrl);
    toast.success('Image uploaded successfully');
  };

  const handleUrlSubmit = () => {
    if (!user) {
      toast.error('Please login to add images');
      return;
    }

    if (imageUrl.trim()) {
      onImageUploaded(imageUrl.trim());
      toast.success('Image URL added successfully');
    }
  };

  return (
    <div className="space-y-4">
      {currentImageUrl && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-background-secondary">
          <img
            src={currentImageUrl}
            alt="Recipe"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={disabled || uploading || !user}
              className="relative"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {uploading ? (
                "Uploading..."
              ) : currentImageUrl ? (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Change Image
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={disabled || !user}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="url">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={disabled || !user}
            />
            <Button 
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled || !imageUrl.trim() || !user}
            >
              Add URL
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      {!user && (
        <p className="text-sm text-red-500">Please login to upload or add images</p>
      )}
    </div>
  );
};

export default ImageUpload;