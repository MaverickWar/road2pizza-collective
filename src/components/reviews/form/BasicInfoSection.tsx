import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ReviewFormData } from "../ReviewForm";

interface BasicInfoSectionProps {
  formData: ReviewFormData;
  setFormData: (data: ReviewFormData) => void;
}

const BasicInfoSection = ({ formData, setFormData }: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Review Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter review title"
        />
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          placeholder="Enter brand name"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Enter category"
        />
      </div>

      <div>
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          placeholder="Enter a brief description"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="content">Full Review Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter your detailed review"
          rows={8}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;