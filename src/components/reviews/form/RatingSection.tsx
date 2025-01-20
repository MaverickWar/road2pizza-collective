import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";
import type { ReviewFormData } from "@/types/review";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface RatingSectionProps {
  form: UseFormReturn<ReviewFormData>;
}

const ratingCriteria = [
  {
    key: "rating" as const,
    label: "Overall Rating",
    description: "Your overall impression of the product",
    color: "text-yellow-500"
  },
  {
    key: "durability_rating" as const,
    label: "Durability",
    description: "How well does it hold up over time?",
    color: "text-blue-500"
  },
  {
    key: "value_rating" as const,
    label: "Value for Money",
    description: "Is it worth the price?",
    color: "text-green-500"
  },
  {
    key: "ease_of_use_rating" as const,
    label: "Ease of Use",
    description: "How user-friendly is the product?",
    color: "text-purple-500"
  }
];

const RatingSection = ({ form }: RatingSectionProps) => {
  const handleRatingChange = (criterion: keyof ReviewFormData, value: number[]) => {
    form.setValue(criterion, value[0]);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-background shadow-none">
        <div className="text-center p-6 bg-muted rounded-lg mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <h3 className="text-lg font-semibold">Overall Rating</h3>
          </div>
          <div className="text-4xl font-bold text-yellow-500">{form.watch("rating")}/5</div>
        </div>

        <div className="space-y-8">
          {ratingCriteria.map(({ key, label, description, color }) => (
            <div key={key} className="space-y-3">
              <div>
                <Label className={`text-base font-semibold ${color}`}>{label}</Label>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Slider
                  value={[form.watch(key) || 5]}
                  onValueChange={(value) => handleRatingChange(key, value)}
                  max={5}
                  step={0.5}
                  className="flex-1"
                />
                <span className="font-medium min-w-[48px] text-center">
                  {form.watch(key)}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RatingSection;