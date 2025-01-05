import { MenuItem } from "@/types/menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";
import { MenuItemDialog } from "./MenuItemDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface MenuItemTableProps {
  items: MenuItem[];
  menuGroupId: string;
}

export function MenuItemTable({ items, menuGroupId }: MenuItemTableProps) {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Menu item deleted successfully",
    });
    queryClient.invalidateQueries({ queryKey: ['menu-items', menuGroupId] });
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex(item => item.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === items.length - 1)
    ) {
      return;
    }

    const newOrder = [...items];
    const item = newOrder[currentIndex];
    const swapWith = newOrder[direction === 'up' ? currentIndex - 1 : currentIndex + 1];

    // Swap display orders
    const tempOrder = item.display_order;
    item.display_order = swapWith.display_order;
    swapWith.display_order = tempOrder;

    // Update both items in the database
    const { error } = await supabase
      .from('menu_items')
      .upsert([
        { id: item.id, display_order: item.display_order },
        { id: swapWith.id, display_order: swapWith.display_order }
      ]);

    if (error) {
      console.error('Error reordering menu items:', error);
      toast({
        title: "Error",
        description: "Failed to reorder menu items",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['menu-items', menuGroupId] });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Access Level</TableHead>
            <TableHead>Visible</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.label}</TableCell>
              <TableCell>{item.path}</TableCell>
              <TableCell>{item.icon}</TableCell>
              <TableCell>
                {item.requires_admin ? "Admin" : item.requires_staff ? "Staff" : "All"}
              </TableCell>
              <TableCell>{item.is_visible ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReorder(item.id, 'up')}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReorder(item.id, 'down')}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingItem(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MenuItemDialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        menuGroupId={menuGroupId}
        itemToEdit={editingItem}
      />
    </>
  );
}