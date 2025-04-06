import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUpload from "./ImageUpload";
import DifficultySelect from "./DifficultySelect";
import { InfoIcon } from "lucide-react";

interface FormFieldsProps {
  formData: {
    title: string;
    content: string;
    image_url: string;
    video_url: string;
    prep_time: string;
    cook_time: string;
    servings: string;
    difficulty: string;
  };
  onChange: (name: string, value: string) => void;
  onImageUploaded: (url: string) => void;
  onVideoUrlChange: (url: string) => void;
  disabled: boolean;
}

const FormFields = ({ 
  formData, 
  onChange, 
  onImageUploaded, 
  onVideoUrlChange,
  disabled 
}: FormFieldsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-semibold">
          Recipe Title <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Choose a descriptive name for your recipe
        </p>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Classic Neapolitan Pizza"
          required
          disabled={disabled}
          className="text-base"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Recipe Image <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Upload a high-quality photo of your finished recipe
        </p>
        <ImageUpload
          onImageUploaded={onImageUploaded}
          currentImageUrl={formData.image_url}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-base font-semibold">
          Description <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Provide a brief overview of your recipe and what makes it special
        </p>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Share the story behind your recipe and what makes it unique..."
          rows={4}
          required
          disabled={disabled}
          className="text-base resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="prep_time" className="text-base font-semibold">
            Prep Time
          </Label>
          <p className="text-sm text-muted-foreground">
            How long does it take to prepare?
          </p>
          <Input
            id="prep_time"
            name="prep_time"
            value={formData.prep_time}
            onChange={handleChange}
            placeholder="e.g., 30 minutes"
            disabled={disabled}
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cook_time" className="text-base font-semibold">
            Cook Time
          </Label>
          <p className="text-sm text-muted-foreground">
            How long does it take to cook?
          </p>
          <Input
            id="cook_time"
            name="cook_time"
            value={formData.cook_time}
            onChange={handleChange}
            placeholder="e.g., 15 minutes"
            disabled={disabled}
            className="text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="servings" className="text-base font-semibold">
            Servings
          </Label>
          <p className="text-sm text-muted-foreground">
            How many people does this recipe serve?
          </p>
          <Input
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            placeholder="e.g., 4 servings"
            disabled={disabled}
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty" className="text-base font-semibold">
            Difficulty Level
          </Label>
          <p className="text-sm text-muted-foreground">
            How challenging is this recipe?
          </p>
          <DifficultySelect
            value={formData.difficulty}
            onValueChange={(value) => onChange('difficulty', value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="video_url" className="text-base font-semibold flex items-center gap-2">
          Video Tutorial
          <div className="inline-flex items-center justify-center rounded-full bg-muted w-5 h-5">
            <InfoIcon className="w-3 h-3" />
          </div>
        </Label>
        <p className="text-sm text-muted-foreground">
          Add a video demonstration (YouTube or Vimeo links supported)
        </p>
        <Input
          id="video_url"
          name="video_url"
          value={formData.video_url}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          placeholder="e.g., https://youtube.com/watch?v=..."
          disabled={disabled}
          className="text-base"
        />
      </div>
    </div>
  );
};

export default FormFields;