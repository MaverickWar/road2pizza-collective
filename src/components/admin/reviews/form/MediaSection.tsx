
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Use the same bucket and folder as the main ImageUpload component
const BUCKET_NAME = 'public';
const PUBLIC_FOLDER = 'recipe-images';

interface MediaSectionProps {
  form: UseFormReturn<ReviewFormData>;
}

const MediaSection = ({ form }: MediaSectionProps) => {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImageInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setError(null);
      console.log('Starting upload to bucket:', BUCKET_NAME);

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${PUBLIC_FOLDER}/${fileName}`;

      console.log('Uploading to', BUCKET_NAME, 'path:', filePath);

      const { error: uploadError, data } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful, data:', data);

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      form.setValue("imageUrl", publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Error uploading image');
      toast.error('Error uploading image');
    } finally {
      if (event.target) event.target.value = '';
    }
  };

  const handleAdditionalImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setError(null);
      console.log('Starting upload to bucket:', BUCKET_NAME);

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${PUBLIC_FOLDER}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful, data:', data);

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      const currentImages = form.getValues("additionalImages") || [];
      form.setValue("additionalImages", [...currentImages, publicUrl]);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Error uploading image');
      toast.error('Error uploading image');
    } finally {
      if (event.target) event.target.value = '';
    }
  };

  const removeAdditionalImage = (index: number) => {
    const currentImages = form.getValues("additionalImages");
    form.setValue(
      "additionalImages",
      currentImages.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <FormLabel>Main Image</FormLabel>
        <div className="mt-2 space-y-4">
          {form.watch("imageUrl") && (
            <div className="relative w-full h-48">
              <img
                src={form.watch("imageUrl")}
                alt="Main review image"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          <div>
            <Input
              ref={mainImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => mainImageInputRef.current?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Main Image
            </Button>
          </div>
        </div>
      </div>

      <div>
        <FormLabel>Additional Images</FormLabel>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {form.watch("additionalImages")?.map((url, index) => (
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
              ref={additionalImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleAdditionalImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full h-32 flex flex-col items-center justify-center"
              onClick={() => additionalImageInputRef.current?.click()}
            >
              <Plus className="w-6 h-6 mb-2" />
              Add Image
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <FormField
        control={form.control}
        name="videoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video URL (YouTube or Vimeo)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter video URL" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MediaSection;
