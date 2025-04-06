
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import ImageUploadTab from "./image-upload/ImageUploadTab";
import ImageUrlTab from "./image-upload/ImageUrlTab";
import { optimizeImage } from "./image-upload/ImageOptimizer";

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

      const optimizedFile = file.type.startsWith('image/') 
        ? await optimizeImage(file)
        : file;

      await uploadFile(optimizedFile || file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
      if (event.target) event.target.value = '';
    }
  };

  const uploadFile = async (file: File) => {
    console.log('Uploading file to Supabase storage');
    
    // Create a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `recipe-images/${fileName}`;

    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully, public URL:', publicUrl);
    onImageUploaded(publicUrl);
    setImageUrl(publicUrl);
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
          <ImageUploadTab
            onFileSelect={handleUpload}
            uploading={uploading}
            currentImageUrl={currentImageUrl}
            disabled={disabled}
          />
        </TabsContent>
        
        <TabsContent value="url">
          <ImageUrlTab
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            onUrlSubmit={handleUrlSubmit}
            disabled={disabled}
          />
        </TabsContent>
      </Tabs>
      {!user && (
        <p className="text-sm text-red-500">Please login to upload or add images</p>
      )}
    </div>
  );
};

export default ImageUpload;
