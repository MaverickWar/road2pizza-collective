import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface NavigationItem {
  id: string;
  page_id: string;
  menu_type: "top" | "main";
  display_order: number;
  is_visible: boolean;
  pages: {
    title: string;
    slug: string;
  };
}

const NavigationManager = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: navigationItems, isLoading } = useQuery({
    queryKey: ["navigation-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("navigation_menu")
        .select(`
          *,
          pages (
            title,
            slug
          )
        `)
        .order("display_order");

      if (error) throw error;
      return data as NavigationItem[];
    },
  });

  const { data: pages } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id, title, slug")
        .order("title");

      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<NavigationItem>;
    }) => {
      const { error } = await supabase
        .from("navigation_menu")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast.success("Navigation updated successfully");
    },
    onError: (error) => {
      console.error("Error updating navigation:", error);
      toast.error("Failed to update navigation");
    },
  });

  const addPageToMenu = async (pageId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("navigation_menu").insert({
        page_id: pageId,
        menu_type: "main",
        display_order: navigationItems?.length || 0,
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast.success("Page added to navigation");
    } catch (error) {
      console.error("Error adding page to navigation:", error);
      toast.error("Failed to add page to navigation");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Navigation Management</h2>
        <Select
          onValueChange={(value) => addPageToMenu(value)}
          disabled={loading}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Add page to menu" />
          </SelectTrigger>
          <SelectContent>
            {pages
              ?.filter(
                (page) =>
                  !navigationItems?.some((item) => item.page_id === page.id)
              )
              .map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page Title</TableHead>
            <TableHead>Menu Type</TableHead>
            <TableHead>Visible</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {navigationItems?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.pages.title}</TableCell>
              <TableCell>
                <Select
                  value={item.menu_type}
                  onValueChange={(value) =>
                    updateMutation.mutate({
                      id: item.id,
                      updates: { menu_type: value as "top" | "main" },
                    })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="main">Main</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Switch
                  checked={item.is_visible}
                  onCheckedChange={(checked) =>
                    updateMutation.mutate({
                      id: item.id,
                      updates: { is_visible: checked },
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    try {
                      const { error } = await supabase
                        .from("navigation_menu")
                        .delete()
                        .eq("id", item.id);

                      if (error) throw error;

                      queryClient.invalidateQueries({
                        queryKey: ["navigation-items"],
                      });
                      toast.success("Item removed from navigation");
                    } catch (error) {
                      console.error("Error removing item:", error);
                      toast.error("Failed to remove item");
                    }
                  }}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NavigationManager;