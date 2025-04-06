import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

const BUCKET_NAME = 'images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ImageUpload = ({ value, onChange, disabled = false }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureStorageBucket = async () => {
    try {
      // Try to get the bucket first
      const { data: bucket, error: getBucketError } = await supabase.storage
        .getBucket(BUCKET_NAME);

      // If bucket doesn't exist, create it
      if (!bucket || getBucketError) {
        console.log('Attempting to create storage bucket:', BUCKET_NAME);
        const { error: createError } = await supabase.storage
          .createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ['image/*'],
            fileSizeLimit: MAX_FILE_SIZE
          });

        if (createError) {
          console.error('Error creating bucket:', createError);
          return false;
        }
      }

      // Verify bucket exists and is accessible
      const { data: verifyBucket, error: verifyError } = await supabase.storage
        .getBucket(BUCKET_NAME);

      if (verifyError || !verifyBucket) {
        console.error('Error verifying bucket:', verifyError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error ensuring storage bucket:', error);
      return false;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image size should be less than 5MB');
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `recipes/${fileName}`;

      console.log('Starting image upload:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        bucket: BUCKET_NAME
      });

      // Ensure storage bucket exists
      const bucketReady = await ensureStorageBucket();
      if (!bucketReady) {
        throw new Error('Unable to access storage. Please try again later.');
      }

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
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

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        console.error('Failed to generate public URL');
        throw new Error('Failed to generate public URL');
      }

      console.log('Public URL generated:', urlData.publicUrl);
      onChange(urlData.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Image URL"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || uploading}
            className={error ? "border-destructive" : ""}
          />
        </div>
        <div>
          <Input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled || uploading}
          />
          <Label htmlFor="image-upload">
            <Button
              type="button"
              variant="outline"
              disabled={disabled || uploading}
              className="cursor-pointer"
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </span>
            </Button>
          </Label>
        </div>
      </div>

      {value && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={value}
            alt="Recipe preview"
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}; 
