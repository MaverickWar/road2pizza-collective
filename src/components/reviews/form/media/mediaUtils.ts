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

    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(filePath);

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