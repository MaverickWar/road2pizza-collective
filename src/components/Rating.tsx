import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  className?: string; // Added className prop
}

export const Rating = ({ value = 0, max = 5, className }: RatingProps) => {
  // Ensure value is a valid number and clamp it between 0 and max
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), max);
  
  const fullStars = Math.floor(safeValue);
  const hasHalfStar = (safeValue % 1) >= 0.5;
  const emptyStars = Math.max(0, max - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
      <span className="ml-2 text-sm text-gray-500">{safeValue.toFixed(1)}</span>
    </div>
  );
};