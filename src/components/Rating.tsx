import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  value: number;
  max?: number;
}

export const Rating = ({ value = 0, max = 5 }: RatingProps) => {
  // Ensure value is a valid number and clamp it between 0 and max
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), max);
  
  const fullStars = Math.floor(safeValue);
  const hasHalfStar = (safeValue % 1) >= 0.5;
  const emptyStars = Math.max(0, max - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="flex items-center gap-0.5">
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