import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MenuItem } from "@/types/menu";
import { MenuItemForm } from "./form/MenuItemForm";

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuGroupId: string;
  itemToEdit?: MenuItem | null;
}

export function MenuItemDialog({ 
  open, 
  onOpenChange,
  menuGroupId,
  itemToEdit 
}: MenuItemDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (data: Partial<MenuItem>) => {
    const submitData = {
      menu_group_id: menuGroupId,
      ...data,
    };

    const { error } = itemToEdit
      ? await supabase
          .from('menu_items')
          .update(submitData)
          .eq('id', itemToEdit.id)
      : await supabase
          .from('menu_items')
          .insert(submitData)
          .select()
          .single();

    if (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Menu item ${itemToEdit ? 'updated' : 'created'} successfully`,
    });
    queryClient.invalidateQueries({ queryKey: ['menu-items', menuGroupId] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {itemToEdit ? 'Edit Menu Item' : 'Create Menu Item'}
          </DialogTitle>
        </DialogHeader>

        <MenuItemForm
          initialData={itemToEdit}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}