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

      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      console.log('Starting upload with auth:', !!user);
      
      const { error: uploadError, data } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, file, {
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      console.log('Upload successful:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);
      onImageUploaded(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image. Please make sure you are logged in.');
    } finally {
      setUploading(false);
    }
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