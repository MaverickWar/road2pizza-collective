import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ReviewFormData } from "../ReviewForm";

interface MediaSectionProps {
  formData: ReviewFormData;
  setFormData: (data: ReviewFormData) => void;
}

const MediaSection = ({ formData, setFormData }: MediaSectionProps) => {
  const [uploading, setUploading] = useState(false);

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, imageUrl: publicUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleAdditionalImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);

      setFormData({
        ...formData,
        additionalImages: [...formData.additionalImages, publicUrl]
      });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData({
      ...formData,
      additionalImages: formData.additionalImages.filter((_, i) => i !== index)
    });
  };

  const handleVideoUrlChange = (url: string) => {
    let provider = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      provider = 'youtube';
    } else if (url.includes('vimeo.com')) {
      provider = 'vimeo';
    }
    setFormData({
      ...formData,
      videoUrl: url,
      videoProvider: provider
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Main Image</Label>
        <div className="mt-2 space-y-4">
          {formData.imageUrl && (
            <div className="relative w-full h-48">
              <img
                src={formData.imageUrl}
                alt="Main review image"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              disabled={uploading}
              className="hidden"
              id="mainImage"
            />
            <Label htmlFor="mainImage" className="cursor-pointer">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={uploading}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Main Image"}
              </Button>
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label>Additional Images</Label>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {formData.additionalImages.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Additional image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeAdditionalImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAdditionalImageUpload}
              disabled={uploading}
              className="hidden"
              id="additionalImage"
            />
            <Label htmlFor="additionalImage" className="cursor-pointer">
              <Button
                type="button"
                variant="outline"
                className="w-full h-32 flex flex-col items-center justify-center"
                disabled={uploading}
              >
                <Plus className="w-6 h-6 mb-2" />
                Add Image
              </Button>
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="videoUrl">Video URL (YouTube or Vimeo)</Label>
        <Input
          id="videoUrl"
          value={formData.videoUrl}
          onChange={(e) => handleVideoUrlChange(e.target.value)}
          placeholder="Enter video URL"
        />
      </div>
    </div>
  );
};

export default MediaSection;