import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MediaGalleryProps {
  imageUrl?: string | null;
  videoUrl?: string | null;
  videoProvider?: string | null;
  images?: string[];
  className?: string;
}

const MediaGallery = ({ imageUrl, videoUrl, videoProvider, images = [], className }: MediaGalleryProps) => {
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

  const embedUrl = videoUrl && videoProvider ? getVideoEmbedUrl(videoUrl, videoProvider) : null;

  return (
    <div className={cn("space-y-4", className)}>
      {imageUrl && (
        <Card className="overflow-hidden">
          <AspectRatio ratio={16/9}>
            <img 
              src={imageUrl} 
              alt="Recipe" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </AspectRatio>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;