import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MenuGroupList } from "@/components/admin/menu/MenuGroupList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MenuGroupDialog } from "@/components/admin/menu/MenuGroupDialog";
import { toast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

export default function MenuManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: menuGroups, isLoading } = useQuery({
    queryKey: ['menu-groups'],
    queryFn: async () => {
      console.log('Fetching menu groups...');
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
      
      console.log('Fetched menu groups:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Menu Management</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Group
          </Button>
        </div>

        {menuGroups?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu groups found</h3>
            <p className="text-gray-500">Get started by creating your first menu group.</p>
          </div>
        ) : (
          <MenuGroupList menuGroups={menuGroups || []} />
        )}
        
        <MenuGroupDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
}