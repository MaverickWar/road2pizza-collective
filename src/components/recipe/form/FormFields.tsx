import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "@/components/ui/image-upload";
import DifficultySelect from "./DifficultySelect";
import { InfoIcon } from "lucide-react";

interface FormFieldsProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

const FormFields = ({ form, disabled = false }: FormFieldsProps) => {
  const handleVideoUrlChange = (url: string) => {
    let provider = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      provider = 'youtube';
    } else if (url.includes('vimeo.com')) {
      provider = 'vimeo';
    }
    form.setValue('video_url', url);
    form.setValue('video_provider', provider);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recipe Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter recipe title" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your recipe" 
                className="min-h-[100px]"
                {...field}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recipe Image</FormLabel>
            <FormControl>
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="video_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video URL (Optional)</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter YouTube or Vimeo URL" 
                {...field}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="prep_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prep Time (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 30 minutes" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cook_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cook Time (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1 hour" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="servings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servings (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 4-6 servings" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty (Optional)</FormLabel>
              <FormControl>
                <DifficultySelect
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default FormFields;