import { Crown, Star } from "lucide-react";

interface BadgePreviewProps {
  title: string;
  color: string;
  isSpecial: boolean;
  imageUrl?: string;
}

const BadgePreview = ({ title, color, isSpecial, imageUrl }: BadgePreviewProps) => {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2" 
          style={{ borderColor: color }} 
        />
      ) : (
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 ring-2 ring-offset-2"
          style={{ borderColor: color }}
        >
          {isSpecial ? (
            <Crown className="w-6 h-6" style={{ color }} />
          ) : (
            <Star className="w-6 h-6" style={{ color }} />
          )}
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-semibold" style={{ color }}>
          {title || "Badge Title"}
        </span>
        <span className="text-xs text-gray-500">
          {isSpecial ? "Special Badge" : "Regular Badge"}
        </span>
      </div>
    </div>
  );
};

export default BadgePreview;