import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MenuGroup } from "@/types/menu";

interface MenuGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupToEdit?: MenuGroup | null;
}

export function MenuGroupDialog({ 
  open, 
  onOpenChange,
  groupToEdit 
}: MenuGroupDialogProps) {
  const [name, setName] = useState(groupToEdit?.name || '');
  const [identifier, setIdentifier] = useState(groupToEdit?.identifier || '');
  const [description, setDescription] = useState(groupToEdit?.description || '');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name,
      identifier,
      description,
    };

    const { error } = groupToEdit 
      ? await supabase
          .from('menu_groups')
          .update(data)
          .eq('id', groupToEdit.id)
      : await supabase
          .from('menu_groups')
          .insert(data)
          .select()
          .single();

    if (error) {
      console.error('Error saving menu group:', error);
      toast({
        title: "Error",
        description: "Failed to save menu group",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Menu group ${groupToEdit ? 'updated' : 'created'} successfully`,
    });
    queryClient.invalidateQueries({ queryKey: ['menu-groups'] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {groupToEdit ? 'Edit Menu Group' : 'Create Menu Group'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identifier">Identifier</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {groupToEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}