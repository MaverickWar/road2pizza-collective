import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FormFields from "./form/FormFields";
import ListEditor from "@/components/article/edit/ListEditor";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface RecipeSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pizzaTypeId?: string;
  pizzaTypeName?: string;
}

const RecipeSubmissionDialog = ({ 
  isOpen, 
  onClose, 
  pizzaTypeId,
  pizzaTypeName 
}: RecipeSubmissionDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    video_url: "",
    video_provider: "",
    ingredients: [] as string[],
    instructions: [] as string[],
    tips: [] as string[],
    prep_time: "",
    cook_time: "",
    servings: "",
    difficulty: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a recipe");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting recipe submission...");

      // Validate required fields
      if (!formData.title || !formData.content || !formData.image_url) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Submit recipe with optimistic update
      const { data, error } = await supabase
        .from("recipes")
        .insert([{
          ...formData,
          category_id: pizzaTypeId,
          created_by: user.id,
          author: user.email,
          status: 'pending',
        }])
        .select()
        .single();

      if (error) throw error;

      console.log("Recipe submitted successfully:", data);
      toast.success("Recipe submitted successfully! It will be reviewed by our team.");
      onClose();
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast.error("Failed to submit recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoUrlChange = (url: string) => {
    let provider = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      provider = 'youtube';
    } else if (url.includes('vimeo.com')) {
      provider = 'vimeo';
    }
    setFormData(prev => ({ 
      ...prev, 
      video_url: url,
      video_provider: provider 
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Submit Recipe for {pizzaTypeName}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormFields
              formData={formData}
              onChange={handleFieldChange}
              onImageUploaded={(url) => handleFieldChange('image_url', url)}
              onVideoUrlChange={handleVideoUrlChange}
              disabled={loading}
            />

            <ListEditor
              title="Ingredients"
              items={formData.ingredients}
              onChange={(items) => setFormData(prev => ({ ...prev, ingredients: items }))}
              placeholder="Add ingredient"
              disabled={loading}
            />

            <ListEditor
              title="Instructions"
              items={formData.instructions}
              onChange={(items) => setFormData(prev => ({ ...prev, instructions: items }))}
              placeholder="Add instruction"
              disabled={loading}
            />

            <ListEditor
              title="Pro Tips"
              items={formData.tips}
              onChange={(items) => setFormData(prev => ({ ...prev, tips: items }))}
              placeholder="Add tip"
              disabled={loading}
            />

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-highlight hover:bg-highlight-hover text-highlight-foreground font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting Recipe...
                  </>
                ) : (
                  "Submit Recipe"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSubmissionDialog; 