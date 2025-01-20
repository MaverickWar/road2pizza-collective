import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import type { FormSectionProps } from "@/types/review";

const RatingSection = ({ formData, setFormData }: FormSectionProps) => {
  const handleRatingChange = (field: keyof typeof formData, value: number[]) => {
    setFormData({ [field]: value[0] });
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-background shadow-none">
        <div className="text-center p-6 bg-muted rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-2">Overall Rating</h3>
          <div className="text-4xl font-bold text-primary">{formData.rating}/5</div>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">Overall Rating</Label>
              <p className="text-sm text-muted-foreground mt-0.5">Your overall impression of the product</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Slider
                value={[formData.rating]}
                onValueChange={(value) => handleRatingChange('rating', value)}
                max={5}
                step={0.5}
                className="flex-1"
              />
              <span className="font-medium min-w-[48px] text-center">
                {formData.rating}/5
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">Durability Rating</Label>
              <p className="text-sm text-muted-foreground mt-0.5">How well does it hold up over time?</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Slider
                value={[formData.durability_rating]}
                onValueChange={(value) => handleRatingChange('durability_rating', value)}
                max={5}
                step={0.5}
                className="flex-1"
              />
              <span className="font-medium min-w-[48px] text-center">
                {formData.durability_rating}/5
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">Value Rating</Label>
              <p className="text-sm text-muted-foreground mt-0.5">Is it worth the price?</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Slider
                value={[formData.value_rating]}
                onValueChange={(value) => handleRatingChange('value_rating', value)}
                max={5}
                step={0.5}
                className="flex-1"
              />
              <span className="font-medium min-w-[48px] text-center">
                {formData.value_rating}/5
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-base font-semibold">Ease of Use Rating</Label>
              <p className="text-sm text-muted-foreground mt-0.5">How user-friendly is the product?</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Slider
                value={[formData.ease_of_use_rating]}
                onValueChange={(value) => handleRatingChange('ease_of_use_rating', value)}
                max={5}
                step={0.5}
                className="flex-1"
              />
              <span className="font-medium min-w-[48px] text-center">
                {formData.ease_of_use_rating}/5
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RatingSection;