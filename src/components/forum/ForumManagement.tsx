import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number | null;
}

const ForumManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");

  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["forumCategories"],
    queryFn: async () => {
      console.log("Fetching forum categories...");
      const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("display_order");

      if (error) throw error;
      console.log("Fetched categories:", data);
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCategory: {
      name: string;
      description: string;
      display_order: number;
    }) => {
      const { data, error } = await supabase
        .from("forum_categories")
        .insert([newCategory])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumCategories"] });
      toast.success("Category created successfully");
      handleClose();
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (category: {
      id: string;
      name: string;
      description: string;
      display_order: number;
    }) => {
      const { data, error } = await supabase
        .from("forum_categories")
        .update({
          name: category.name,
          description: category.description,
          display_order: category.display_order,
        })
        .eq("id", category.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumCategories"] });
      toast.success("Category updated successfully");
      handleClose();
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("forum_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumCategories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
      name,
      description,
      display_order: parseInt(displayOrder) || 0,
    };

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        ...categoryData,
      });
    } else {
      createMutation.mutate(categoryData);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setDisplayOrder(category.display_order?.toString() || "0");
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingCategory(null);
    setName("");
    setDescription("");
    setDisplayOrder("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Forum Categories</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Category description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    placeholder="Display order"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">
                    {editingCategory ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div>Loading categories...</div>
        ) : (
          <div className="space-y-4">
            {categories?.map((category: Category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-card hover:bg-card-hover rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-500">{category.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this category?"
                        )
                      ) {
                        deleteMutation.mutate(category.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ForumManagement;