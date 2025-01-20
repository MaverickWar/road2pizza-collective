import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";
import { MainImageUpload } from "./media/MainImageUpload";
import { AdditionalImagesUpload } from "./media/AdditionalImagesUpload";

interface MediaSectionProps {
  form: UseFormReturn<ReviewFormData>;
}

const MediaSection = ({ form }: MediaSectionProps) => {
  const [uploading, setUploading] = useState(false);

  const handleVideoUrlChange = (url: string) => {
    let provider = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      provider = 'youtube';
    } else if (url.includes('vimeo.com')) {
      provider = 'vimeo';
    }
    form.setValue("videoUrl", url);
    form.setValue("videoProvider", provider);
  };

  return (
    <div className="space-y-6">
      <MainImageUpload form={form} uploading={uploading} />
      <AdditionalImagesUpload form={form} uploading={uploading} />

      <div>
        <Label htmlFor="videoUrl">Video URL (YouTube or Vimeo)</Label>
        <Input
          id="videoUrl"
          value={form.watch("videoUrl")}
          onChange={(e) => handleVideoUrlChange(e.target.value)}
          placeholder="Enter video URL"
        />
      </div>
    </div>
  );
};

export default MediaSection;