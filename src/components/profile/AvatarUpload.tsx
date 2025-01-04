import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, UserRound } from 'lucide-react';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
}

export const AvatarUpload = ({ userId, currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setIsUploading(true);
      console.log('Starting image upload for user:', userId);

      // Create a canvas to resize the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = async () => {
        // Set fixed dimensions for the avatar
        const size = 256; // Standard size for avatars
        canvas.width = size;
        canvas.height = size;

        if (ctx) {
          // Calculate the crop dimensions
          const minDimension = Math.min(img.width, img.height);
          const sourceX = (img.width - minDimension) / 2;
          const sourceY = (img.height - minDimension) / 2;

          // Draw the image with cropping and resizing
          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            minDimension,
            minDimension,
            0,
            0,
            size,
            size
          );

          // Convert canvas to blob
          canvas.toBlob(async (blob) => {
            if (!blob) {
              toast.error('Error processing image');
              setIsUploading(false);
              return;
            }

            // Upload image to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('profile-images')
              .upload(fileName, blob, {
                contentType: 'image/jpeg',
                upsert: true,
              });

            if (uploadError) {
              console.error('Upload error:', uploadError);
              throw uploadError;
            }

            console.log('Upload successful:', uploadData);

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('profile-images')
              .getPublicUrl(fileName);

            console.log('Generated public URL:', publicUrl);

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ avatar_url: publicUrl })
              .eq('id', userId);

            if (updateError) {
              console.error('Profile update error:', updateError);
              throw updateError;
            }

            onAvatarUpdate(publicUrl);
            toast.success('Profile image updated successfully');
            setIsUploading(false);
          }, 'image/jpeg', 0.9);
        }
      };

      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile image');
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-24 h-24">
        <AvatarImage
          src={currentAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
          alt="Profile"
        />
        <AvatarFallback>
          <UserRound className="w-12 h-12" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="avatar-upload"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Label>
      </div>
    </div>
  );
};