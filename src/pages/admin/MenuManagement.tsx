import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MenuGroupList } from "@/components/admin/menu/MenuGroupList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MenuGroupDialog } from "@/components/admin/menu/MenuGroupDialog";
import { toast } from "@/components/ui/use-toast";

export default function MenuManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: menuGroups, isLoading } = useQuery({
    queryKey: ['menu-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_groups')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching menu groups:', error);
        toast({
          title: "Error",
          description: "Failed to load menu groups",
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Menu Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Group
        </Button>
      </div>

      <MenuGroupList menuGroups={menuGroups || []} />
      
      <MenuGroupDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}