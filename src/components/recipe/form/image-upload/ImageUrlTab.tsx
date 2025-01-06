import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";

interface ImageUrlTabProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onUrlSubmit: () => void;
  disabled?: boolean;
}

const ImageUrlTab = ({ imageUrl, onImageUrlChange, onUrlSubmit, disabled }: ImageUrlTabProps) => {
  const { user } = useAuth();

  return (
    <div className="flex gap-2">
      <Input
        type="url"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => onImageUrlChange(e.target.value)}
        disabled={disabled || !user}
      />
      <Button 
        type="button"
        onClick={onUrlSubmit}
        disabled={disabled || !imageUrl.trim() || !user}
      >
        Add URL
      </Button>
    </div>
  );
};

export default ImageUrlTab;