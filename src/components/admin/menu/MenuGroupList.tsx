import { MenuGroup } from "@/types/menu";
import { MenuItemList } from "./MenuItemList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { MenuGroupDialog } from "./MenuGroupDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface MenuGroupListProps {
  menuGroups: MenuGroup[];
}

export function MenuGroupList({ menuGroups }: MenuGroupListProps) {
  const [editingGroup, setEditingGroup] = useState<MenuGroup | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('menu_groups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu group:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu group",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Menu group deleted successfully",
    });
    queryClient.invalidateQueries({ queryKey: ['menu-groups'] });
  };

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        {menuGroups.map((group) => (
          <AccordionItem key={group.id} value={group.id}>
            <div className="flex items-center justify-between">
              <AccordionTrigger className="flex-1">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium">{group.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {group.identifier}
                  </span>
                </div>
              </AccordionTrigger>
              <div className="flex items-center gap-2 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingGroup(group);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(group.id);
                  }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <AccordionContent>
              <div className="pt-4">
                <MenuItemList menuGroupId={group.id} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <MenuGroupDialog
        open={!!editingGroup}
        onOpenChange={(open) => !open && setEditingGroup(null)}
        groupToEdit={editingGroup}
      />
    </div>
  );
}