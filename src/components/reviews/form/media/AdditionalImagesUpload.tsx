import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { handleImageUpload } from "./mediaUtils";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";

interface AdditionalImagesUploadProps {
  form: UseFormReturn<ReviewFormData>;
  uploading: boolean;
  setUploading: (value: boolean) => void;
}

export const AdditionalImagesUpload = ({ form, uploading, setUploading }: AdditionalImagesUploadProps) => {
  const additionalImageInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    try {
      await handleImageUpload(e, form, "additionalImages");
    } finally {
      setUploading(false);
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
    <div>
      <Label>Additional Images</Label>
      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
        {form.watch("additionalImages")?.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Additional image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg pointer-events-none"
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
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full h-32 flex flex-col items-center justify-center"
            disabled={uploading}
            onClick={() => additionalImageInputRef.current?.click()}
          >
            <Plus className="w-6 h-6 mb-2" />
            Add Image
          </Button>
        </div>
      </div>
    </div>
  );
};