import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MenuGroupDialog } from "@/components/admin/menu/MenuGroupDialog";
import { toast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MenuItemDialog } from "@/components/admin/menu/MenuItemDialog";

export default function MenuManagement() {
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const { data: menuGroups, isLoading } = useQuery({
    queryKey: ['menu-groups-with-items'],
    queryFn: async () => {
      console.log('Fetching menu groups with items...');
      const { data: groups, error: groupsError } = await supabase
        .from('menu_groups')
        .select('*')
        .order('name');
      
      if (groupsError) {
        console.error('Error fetching menu groups:', groupsError);
        toast({
          title: "Error",
          description: "Failed to load menu groups",
          variant: "destructive",
        });
        throw groupsError;
      }

      // Fetch menu items for each group
      const groupsWithItems = await Promise.all(
        groups.map(async (group) => {
          const { data: items, error: itemsError } = await supabase
            .from('menu_items')
            .select('*')
            .eq('menu_group_id', group.id)
            .order('display_order');

          if (itemsError) {
            console.error(`Error fetching menu items for group ${group.id}:`, itemsError);
            return { ...group, items: [] };
          }

          return { ...group, items: items || [] };
        })
      );
      
      console.log('Fetched menu groups with items:', groupsWithItems);
      return groupsWithItems;
    },
  });

  const handleAddMenuItem = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsItemDialogOpen(true);
  };

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
          <Button onClick={() => setIsGroupDialogOpen(true)}>
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
          <Accordion type="single" collapsible className="w-full space-y-4">
            {menuGroups?.map((group) => (
              <AccordionItem key={group.id} value={group.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-medium">{group.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {group.identifier}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddMenuItem(group.id);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                <AccordionContent>
                  <div className="mt-4">
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
                        {group.items?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.label}</TableCell>
                            <TableCell>{item.path}</TableCell>
                            <TableCell>{item.icon}</TableCell>
                            <TableCell>
                              {item.requires_admin
                                ? "Admin"
                                : item.requires_staff
                                ? "Staff"
                                : "All"}
                            </TableCell>
                            <TableCell>{item.is_visible ? "Yes" : "No"}</TableCell>
                            <TableCell className="text-right">
                              {/* Add edit/delete actions here */}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        
        <MenuGroupDialog 
          open={isGroupDialogOpen} 
          onOpenChange={setIsGroupDialogOpen}
        />

        <MenuItemDialog
          open={isItemDialogOpen}
          onOpenChange={setIsItemDialogOpen}
          menuGroupId={selectedGroupId}
        />
      </div>
    </DashboardLayout>
  );
}