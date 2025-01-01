import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import EditRecipeForm from "./edit/EditRecipeForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/AuthProvider";

interface EditRecipeModalProps {
  recipe: any;
  onClose: () => void;
}

const EditRecipeModal = ({ recipe, onClose }: EditRecipeModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleSave = async (formData: any) => {
    setIsLoading(true);
    try {
      console.log("Updating recipe with data:", formData);

      // Check if user requires approval
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('requires_recipe_approval')
        .eq('id', user?.id)
        .single();

      // Get user's post count
      const { data: postCount } = await supabase
        .from('forum_posts')
        .select('id', { count: true })
        .eq('created_by', user?.id);

      const requiresApproval = userProfile?.requires_recipe_approval || (postCount?.length || 0) < 5;

      const { error } = await supabase
        .from("recipes")
        .update({
          ...formData,
          last_edited_at: new Date().toISOString(),
          edit_requires_approval: requiresApproval,
          approval_status: requiresApproval ? 'pending' : 'approved'
        })
        .eq("id", recipe.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["recipes-with-reviews"] });
      await queryClient.invalidateQueries({ queryKey: ["recipe", recipe.id] });

      toast.success(requiresApproval ? 
        'Recipe updated successfully and sent for approval' : 
        'Recipe updated successfully'
      );
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
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Recipe: {recipe.title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
          <div className="space-y-6">
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