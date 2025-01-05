import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MenuItem } from "@/types/menu";

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
  const [label, setLabel] = useState(itemToEdit?.label || '');
  const [path, setPath] = useState(itemToEdit?.path || '');
  const [icon, setIcon] = useState(itemToEdit?.icon || '');
  const [description, setDescription] = useState(itemToEdit?.description || '');
  const [requiresAdmin, setRequiresAdmin] = useState(itemToEdit?.requires_admin || false);
  const [requiresStaff, setRequiresStaff] = useState(itemToEdit?.requires_staff || false);
  const [isVisible, setIsVisible] = useState(itemToEdit?.is_visible ?? true);
  
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const operation = itemToEdit ? 'update' : 'insert';
    const { data, error } = await supabase
      .from('menu_items')
      [operation]({
        id: itemToEdit?.id,
        menu_group_id: menuGroupId,
        label,
        path,
        icon,
        description,
        requires_admin: requiresAdmin,
        requires_staff: requiresStaff,
        is_visible: isVisible,
        display_order: itemToEdit?.display_order || 0,
      })
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="path">Path</Label>
            <Input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g., home, settings, user"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="requires-admin">Requires Admin</Label>
            <Switch
              id="requires-admin"
              checked={requiresAdmin}
              onCheckedChange={setRequiresAdmin}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="requires-staff">Requires Staff</Label>
            <Switch
              id="requires-staff"
              checked={requiresStaff}
              onCheckedChange={setRequiresStaff}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is-visible">Visible</Label>
            <Switch
              id="is-visible"
              checked={isVisible}
              onCheckedChange={setIsVisible}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {itemToEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}