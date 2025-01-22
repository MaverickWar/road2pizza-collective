import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface ArticleImageProps {
  imageUrl: string;
  title: string;
  isFeatured?: boolean;
  createdAt?: string;
}

const ArticleImage = ({ imageUrl, title, isFeatured, createdAt }: ArticleImageProps) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    console.log('Image failed to load, falling back to placeholder');
    setImageError(true);
  };

  const isNewRecipe = (createdAt?: string) => {
    if (!createdAt) return false;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(createdAt) > oneMonthAgo;
  };

  const showRibbon = isFeatured || isNewRecipe(createdAt);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg mb-8 bg-secondary">
      <AspectRatio ratio={16 / 9} className="bg-muted relative">
        {/* Ribbon */}
        {showRibbon && (
          <div className="absolute top-0 left-0 z-10 overflow-hidden h-24 w-24">
            <div className={cn(
              "absolute top-[20px] left-[-45px] w-[170px] text-center py-2 -rotate-45",
              "text-white text-sm font-semibold shadow-lg",
              isFeatured 
                ? "bg-admin text-white" 
                : "bg-white text-admin border border-admin/20"
            )}>
              {isFeatured ? "Featured" : "New"}
            </div>
          </div>
        )}
        
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