import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import EditRecipeForm from "./edit/EditRecipeForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditRecipeModalProps {
  recipe: any;
  onClose: () => void;
}

const EditRecipeModal = ({ recipe, onClose }: EditRecipeModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async (formData: any) => {
    setIsLoading(true);
    try {
      console.log("Updating recipe with data:", formData);

      const { error } = await supabase
        .from("recipes")
        .update(formData)
        .eq("id", recipe.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["recipes-with-reviews"] });
      await queryClient.invalidateQueries({ queryKey: ["recipe", recipe.id] });

      toast.success("Recipe updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Recipe: {recipe.title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6 py-4">
            <EditRecipeForm
              recipe={recipe}
              onSave={handleSave}
              onCancel={onClose}
              isLoading={isLoading}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeModal;