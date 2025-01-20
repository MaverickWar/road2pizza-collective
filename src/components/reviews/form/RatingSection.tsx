import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";

interface RatingSectionProps {
  form: UseFormReturn<ReviewFormData>;
}

const ratingCriteria = [
  {
    key: "rating" as const,
    label: "Overall Rating",
    description: "Overall rating of the product"
  },
  {
    key: "durability_rating" as const,
    label: "Durability",
    description: "Long-term durability and build quality"
  },
  {
    key: "value_rating" as const,
    label: "Value for Money",
    description: "Price point relative to features and quality"
  },
  {
    key: "ease_of_use_rating" as const,
    label: "Ease of Use",
    description: "How intuitive and user-friendly is the product"
  }
];

const RatingSection = ({ form }: RatingSectionProps) => {
  const handleRatingChange = (criterion: keyof ReviewFormData, value: number[]) => {
    form.setValue(criterion, value[0]);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {ratingCriteria.map(({ key, label, description }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>{label}</Label>
              <span className="text-sm font-medium">
                {form.watch(key)}/5
              </span>
            </div>
            <Slider
              value={[form.watch(key) || 5]}
              onValueChange={(value) => handleRatingChange(key, value)}
              max={5}
              step={0.5}
              className="my-4"
            />
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSection;