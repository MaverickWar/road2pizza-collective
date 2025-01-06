import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

interface ImageUploadTabProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  currentImageUrl?: string | null;
  disabled?: boolean;
}

const ImageUploadTab = ({ onFileSelect, uploading, currentImageUrl, disabled }: ImageUploadTabProps) => {
  const { user } = useAuth();

  return (
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
        onChange={onFileSelect}
        className="hidden"
        disabled={disabled || !user}
      />
    </div>
  );
};

export default ImageUploadTab;