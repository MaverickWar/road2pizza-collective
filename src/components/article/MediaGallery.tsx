import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface MediaGalleryProps {
  imageUrl?: string | null;
  videoUrl?: string | null;
  videoProvider?: string | null;
  images?: string[];
  className?: string;
}

const MediaGallery = ({ imageUrl, videoUrl, videoProvider, images = [], className }: MediaGalleryProps) => {
  const [imageError, setImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const fallbackImage = "https://images.unsplash.com/photo-1504893524553-b855bce32c67";

  const getVideoEmbedUrl = (url: string, provider: string) => {
    if (provider === 'youtube') {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/);
      return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : null;
    } else if (provider === 'vimeo') {
      const videoId = url.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/);
      return videoId ? `https://player.vimeo.com/video/${videoId[1]}` : null;
    }
    return null;
  };

  const handleImageError = () => {
    console.log('Image failed to load, using fallback');
    setImageError(true);
  };

  const embedUrl = videoUrl && videoProvider ? getVideoEmbedUrl(videoUrl, videoProvider) : null;

  return (
    <div className={cn("space-y-4", className)}>
      {(imageUrl || imageError) && (
        <Card className="overflow-hidden">
          <AspectRatio ratio={16/9}>
            <img 
              src={!imageError ? imageUrl || fallbackImage : fallbackImage}
              alt="Recipe" 
              onError={handleImageError}
              onClick={() => setSelectedImage(!imageError ? imageUrl || fallbackImage : fallbackImage)}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </AspectRatio>
        </Card>
      )}

      {embedUrl && (
        <Card className="overflow-hidden">
          <AspectRatio ratio={16/9}>
            <iframe
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </AspectRatio>
        </Card>
      )}

      {images && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <Card key={index} className="overflow-hidden">
              <AspectRatio ratio={1}>
                <img 
                  src={img} 
                  alt={`Recipe image ${index + 1}`}
                  onError={(e) => {
                    console.log(`Additional image ${index + 1} failed to load, using fallback`);
                    (e.target as HTMLImageElement).src = fallbackImage;
                  }}
                  onClick={() => setSelectedImage(img)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </AspectRatio>
            </Card>
          ))}
        </div>
      )}

      <ImageModal
        imageUrl={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default MediaGallery;