import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";

interface BasicInfoSectionProps {
  form: UseFormReturn<ReviewFormData>;
}

const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Review Title</Label>
        <Input
          id="title"
          {...form.register("title")}
          placeholder="Enter review title"
        />
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          {...form.register("brand")}
          placeholder="Enter brand name"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          {...form.register("category")}
          placeholder="Enter category"
        />
      </div>

      <div>
        <Label htmlFor="content">Full Review Content</Label>
        <Textarea
          id="content"
          {...form.register("content")}
          placeholder="Enter your detailed review"
          rows={8}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;