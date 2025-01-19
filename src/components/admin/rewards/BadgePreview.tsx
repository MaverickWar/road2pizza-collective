import { Crown, Star } from "lucide-react";

interface BadgePreviewProps {
  title: string;
  color: string;
  isSpecial: boolean;
  imageUrl?: string;
}

const BadgePreview = ({ title, color, isSpecial, imageUrl }: BadgePreviewProps) => {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg transition-colors" style={{ backgroundColor: `${color}20` }}>
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 transition-shadow" 
          style={{ borderColor: color }} 
        />
      ) : (
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-offset-2 transition-all"
          style={{ backgroundColor: `${color}20`, borderColor: color }}
        >
          {isSpecial ? (
            <Crown className="w-6 h-6 transition-transform hover:scale-110" style={{ color }} />
          ) : (
            <Star className="w-6 h-6 transition-transform hover:scale-110" style={{ color }} />
          )}
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-semibold transition-colors" style={{ color }}>
          {title || "Badge Preview"}
        </span>
        <span className="text-xs text-muted-foreground">
          {isSpecial ? "Special Badge" : "Regular Badge"}
        </span>
      </div>
    </div>
  );
};

export default BadgePreview;