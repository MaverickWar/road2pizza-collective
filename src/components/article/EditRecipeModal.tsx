import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import EditRecipeForm from "./edit/EditRecipeForm";

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

      // Invalidate all relevant queries
      await queryClient.invalidateQueries({ queryKey: ["article"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-recipes"] });
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      await queryClient.invalidateQueries({ queryKey: ["featured-recipes"] });
      await queryClient.invalidateQueries({ queryKey: ["mock-article"] });

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
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Edit Recipe: {recipe.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <EditRecipeForm
            recipe={recipe}
            onSave={handleSave}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeModal;