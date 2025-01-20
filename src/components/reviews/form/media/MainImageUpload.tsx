import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { handleImageUpload } from "./mediaUtils";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";

interface MainImageUploadProps {
  form: UseFormReturn<ReviewFormData>;
  uploading: boolean;
  setUploading: (value: boolean) => void;
}

export const MainImageUpload = ({ form, uploading, setUploading }: MainImageUploadProps) => {
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    try {
      await handleImageUpload(e, form, "imageUrl");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Label>Main Image</Label>
      <div className="mt-2 space-y-4">
        {form.watch("imageUrl") && (
          <div className="relative w-full h-48">
            <img
              src={form.watch("imageUrl")}
              alt="Main review image"
              className="w-full h-full object-cover rounded-lg pointer-events-none"
            />
          </div>
        )}
        <div>
          <Input
            ref={mainImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={uploading}
            onClick={() => mainImageInputRef.current?.click()}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Main Image"}
          </Button>
        </div>
      </div>
    </div>
  );
};