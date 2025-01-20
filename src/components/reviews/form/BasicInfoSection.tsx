import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import type { ReviewFormData } from "@/types/review";
import { Card } from "@/components/ui/card";

interface BasicInfoSectionProps {
  form: UseFormReturn<ReviewFormData>;
}

const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  return (
    <Card className="p-6 space-y-6 bg-background shadow-none">
      <div>
        <Label htmlFor="title" className="text-base font-semibold">Review Title</Label>
        <p className="text-sm text-muted-foreground mt-0.5">Write a clear, descriptive title</p>
        <Input
          id="title"
          {...form.register("title")}
          placeholder="e.g., Amazing Professional Stand Mixer"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="brand" className="text-base font-semibold">Brand</Label>
        <p className="text-sm text-muted-foreground mt-0.5">Enter the product brand name</p>
        <Input
          id="brand"
          {...form.register("brand")}
          placeholder="e.g., KitchenAid, Cuisinart"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="category" className="text-base font-semibold">Category</Label>
        <p className="text-sm text-muted-foreground mt-0.5">Select the product category</p>
        <Input
          id="category"
          {...form.register("category")}
          placeholder="e.g., Stand Mixers, Food Processors"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="content" className="text-base font-semibold">Full Review</Label>
        <p className="text-sm text-muted-foreground mt-0.5">Share your detailed experience with the product</p>
        <Textarea
          id="content"
          {...form.register("content")}
          placeholder="Describe your experience with the product, including what you liked and didn't like..."
          className="mt-2 min-h-[200px] resize-none"
          rows={8}
        />
      </div>
    </Card>
  );
};

export default BasicInfoSection;