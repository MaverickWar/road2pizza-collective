import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUpload from "./ImageUpload";
import DifficultySelect from "./DifficultySelect";

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
      <div>
        <Label htmlFor="title">Recipe Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={disabled}
        />
      </div>

      <div>
        <Label>Recipe Image</Label>
        <ImageUpload
          onImageUploaded={onImageUploaded}
          currentImageUrl={formData.image_url}
          disabled={disabled}
        />
      </div>

      <div>
        <Label htmlFor="content">Description</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={4}
          required
          disabled={disabled}
        />
      </div>

      <div>
        <Label htmlFor="difficulty">Difficulty</Label>
        <DifficultySelect
          value={formData.difficulty}
          onValueChange={(value) => onChange('difficulty', value)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="prep_time">Prep Time</Label>
          <Input
            id="prep_time"
            name="prep_time"
            value={formData.prep_time}
            onChange={handleChange}
            placeholder="e.g., 30 minutes"
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="cook_time">Cook Time</Label>
          <Input
            id="cook_time"
            name="cook_time"
            value={formData.cook_time}
            onChange={handleChange}
            placeholder="e.g., 15 minutes"
            disabled={disabled}
          />
        </div>
        <div>
          <Label htmlFor="servings">Servings</Label>
          <Input
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            placeholder="e.g., 4"
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="video_url">Video URL (YouTube or Vimeo)</Label>
        <Input
          id="video_url"
          name="video_url"
          value={formData.video_url}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          placeholder="e.g., https://youtube.com/watch?v=..."
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default FormFields;