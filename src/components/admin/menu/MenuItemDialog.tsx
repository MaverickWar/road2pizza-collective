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
    // Ensure required fields are present
    if (!data.label || !data.path) {
      toast({
        title: "Error",
        description: "Label and path are required fields",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      menu_group_id: menuGroupId,
      label: data.label,
      path: data.path,
      icon: data.icon || null,
      description: data.description || null,
      parent_id: data.parent_id || null,
      requires_admin: data.requires_admin || false,
      requires_staff: data.requires_staff || false,
      display_order: data.display_order || 0,
      is_visible: data.is_visible ?? true,
    };

    console.log('Submitting menu item data:', submitData);

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