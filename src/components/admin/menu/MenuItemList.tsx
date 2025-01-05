import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MenuItem } from "@/types/menu";
import { MenuItemDialog } from "./MenuItemDialog";
import { MenuItemTable } from "./MenuItemTable";
import { toast } from "@/components/ui/use-toast";

interface MenuItemListProps {
  menuGroupId: string;
}

export function MenuItemList({ menuGroupId }: MenuItemListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu-items', menuGroupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('menu_group_id', menuGroupId)
        .order('display_order');
      
      if (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive",
        });
        throw error;
      }
      
      return data as MenuItem[];
    },
  });

  if (isLoading) {
    return <div>Loading items...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <MenuItemTable items={menuItems || []} menuGroupId={menuGroupId} />
      
      <MenuItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        menuGroupId={menuGroupId}
      />
    </div>
  );
}