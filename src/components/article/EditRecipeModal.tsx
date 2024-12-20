import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Editor from '@/components/Editor';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface EditRecipeModalProps {
  recipe: any;
  onClose: () => void;
}

const EditRecipeModal = ({ recipe, onClose }: EditRecipeModalProps) => {
  const [content, setContent] = React.useState(recipe.content || '');
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ content })
        .eq('id', recipe.id);

      if (error) throw error;

      toast.success('Recipe updated successfully');
      queryClient.invalidateQueries({ queryKey: ['article'] });
      onClose();
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
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
          <Editor content={content} onChange={setContent} />
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeModal;