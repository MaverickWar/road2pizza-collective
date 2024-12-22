import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ArticleImageProps {
  imageUrl: string;
  title: string;
}

const ArticleImage = ({ imageUrl, title }: ArticleImageProps) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    console.log('Image failed to load, falling back to placeholder');
    setImageError(true);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg mb-8 bg-secondary">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img 
          src={!imageError ? imageUrl || '/placeholder.svg' : '/placeholder.svg'}
          alt={title}
          onError={handleImageError}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </AspectRatio>
    </div>
  );
};

export default ArticleImage;