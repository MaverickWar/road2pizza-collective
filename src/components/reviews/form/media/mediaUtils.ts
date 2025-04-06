
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleImageUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  form: UseFormReturn<ReviewFormData>,
  field: "imageUrl" | "additionalImages"
) => {
  try {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Starting image upload for review');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `review-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully:', publicUrl);

    if (field === "imageUrl") {
      form.setValue("imageUrl", publicUrl);
    } else {
      const currentImages = form.getValues("additionalImages") || [];
      form.setValue("additionalImages", [...currentImages, publicUrl]);
    }
    
    toast.success('Image uploaded successfully');
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Error uploading image');
  } finally {
    if (event.target) event.target.value = '';
  }
};
