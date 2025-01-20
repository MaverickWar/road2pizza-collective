import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";
import { MainImageUpload } from "./media/MainImageUpload";
import { AdditionalImagesUpload } from "./media/AdditionalImagesUpload";

interface MediaSectionProps {
  form: UseFormReturn<ReviewFormData>;
}

const MediaSection = ({ form }: MediaSectionProps) => {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-6">
      <MainImageUpload form={form} uploading={uploading} setUploading={setUploading} />
      <AdditionalImagesUpload form={form} uploading={uploading} setUploading={setUploading} />
    </div>
  );
};

export default MediaSection;