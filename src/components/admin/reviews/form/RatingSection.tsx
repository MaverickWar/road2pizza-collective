import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import type { ReviewFormData } from "../ReviewForm";

interface RatingSectionProps {
  formData: ReviewFormData;
  setFormData: (data: ReviewFormData) => void;
}

const ratingCriteria = [
  {
    key: "design" as const,
    label: "Design",
    description: "Overall design, build quality, and aesthetics"
  },
  {
    key: "easeOfUse" as const,
    label: "Ease of Use",
    description: "How intuitive and user-friendly is the product"
  },
  {
    key: "portability" as const,
    label: "Portability",
    description: "Weight, size, and ease of transportation"
  },
  {
    key: "valueForMoney" as const,
    label: "Value for Money",
    description: "Price point relative to features and quality"
  },
  {
    key: "reliability" as const,
    label: "Reliability & Aftercare",
    description: "Long-term durability and customer support"
  }
];

const RatingSection = ({ formData, setFormData }: RatingSectionProps) => {
  const handleRatingChange = (criterion: keyof typeof formData.ratings, value: number[]) => {
    setFormData({
      ...formData,
      ratings: {
        ...formData.ratings,
        [criterion]: value[0]
      }
    });
  };

  const handleDescriptionChange = (criterion: keyof typeof formData.ratings.descriptions, value: string) => {
    setFormData({
      ...formData,
      ratings: {
        ...formData.ratings,
        descriptions: {
          ...formData.ratings.descriptions,
          [criterion]: value
        }
      }
    });
  };

  const calculateOverallRating = () => {
    const { design, easeOfUse, portability, valueForMoney, reliability } = formData.ratings;
    return ((design + easeOfUse + portability + valueForMoney + reliability) / 5).toFixed(1);
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-background shadow-none">
        <div className="text-center p-6 bg-muted rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-2">Overall Rating</h3>
          <div className="text-4xl font-bold text-primary">{calculateOverallRating()}/5</div>
        </div>

        <div className="space-y-8">
          {ratingCriteria.map(({ key, label, description }) => (
            <div key={key} className="space-y-3">
              <div>
                <Label className="text-base font-semibold">{label}</Label>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Slider
                  value={[formData.ratings[key]]}
                  onValueChange={(value) => handleRatingChange(key, value)}
                  max={5}
                  step={0.5}
                  className="flex-1"
                />
                <span className="font-medium min-w-[48px] text-center">
                  {formData.ratings[key]}/5
                </span>
              </div>

              <Textarea
                value={formData.ratings.descriptions[key]}
                onChange={(e) => handleDescriptionChange(key, e.target.value)}
                placeholder={`Describe the ${label.toLowerCase()}...`}
                className="resize-none"
                rows={2}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RatingSection;