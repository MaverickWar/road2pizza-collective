import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import type { FormSectionProps } from "@/types/review";

const BasicInfoSection = ({ formData, setFormData }: FormSectionProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-background shadow-none">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-base font-semibold">Review Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
              placeholder="Enter a descriptive title for your review"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="brand" className="text-base font-semibold">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ brand: e.target.value })}
              placeholder="Enter the brand name"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-base font-semibold">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ category: e.target.value })}
              placeholder="e.g., Kitchen Equipment, Tools, Accessories"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-base font-semibold">Full Review Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ content: e.target.value })}
              placeholder="Write your detailed review here..."
              className="mt-1.5 min-h-[200px] resize-none"
              rows={8}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BasicInfoSection;