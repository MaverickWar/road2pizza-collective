import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pizza, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Editor from "@/components/Editor";

interface PizzaType {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  slug: string;
}

const PizzaTypeManagement = () => {
  const [newPizzaType, setNewPizzaType] = useState({ name: "", description: "" });
  const [editingType, setEditingType] = useState<PizzaType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: pizzaTypes, isLoading } = useQuery({
    queryKey: ["pizza-types-admin"],
    queryFn: async () => {
      console.log("Fetching pizza types for admin...");
      const { data, error } = await supabase
        .from("pizza_types")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching pizza types:", error);
        throw error;
      }

      console.log("Fetched pizza types:", data);
      return data as PizzaType[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newType: typeof newPizzaType) => {
      // First check if pizza type exists (including hidden ones)
      const { data: existingPizza, error: checkError } = await supabase
        .from("pizza_types")
        .select("*")
        .ilike("name", newType.name)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingPizza) {
        if (existingPizza.is_hidden) {
          const { error: updateError } = await supabase
            .from("pizza_types")
            .update({
              description: newType.description || existingPizza.description,
              is_hidden: false,
            })
            .eq("id", existingPizza.id);

          if (updateError) throw updateError;
          return existingPizza;
        } else {
          throw new Error("This pizza type already exists");
        }
      }

      const { data, error } = await supabase
        .from("pizza_types")
        .insert([
          {
            name: newType.name,
            description: newType.description,
            slug: newType.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, ''),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pizza-types-admin"] });
      setNewPizzaType({ name: "", description: "" });
      toast.success("Pizza type created successfully");
    },
    onError: (error: Error) => {
      console.error("Error creating pizza type:", error);
      toast.error(error.message || "Failed to create pizza type");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (type: PizzaType) => {
      const { error } = await supabase
        .from("pizza_types")
        .update({
          name: type.name,
          description: type.description,
          image_url: type.image_url,
          slug: type.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
        })
        .eq("id", type.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pizza-types-admin"] });
      setIsEditDialogOpen(false);
      setEditingType(null);
      toast.success("Pizza type updated successfully");
    },
    onError: (error) => {
      console.error("Error updating pizza type:", error);
      toast.error("Failed to update pizza type");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pizza_types")
        .update({ is_hidden: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pizza-types-admin"] });
      toast.success("Pizza type deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting pizza type:", error);
      toast.error("Failed to delete pizza type");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPizzaType.name) {
      toast.error("Please enter a name for the pizza type");
      return;
    }
    createMutation.mutate(newPizzaType);
  };

  const handleEdit = (type: PizzaType) => {
    setEditingType(type);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingType) return;
    updateMutation.mutate(editingType);
  };

  const content = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pizza className="h-5 w-5" />
            Add New Pizza Type
          </CardTitle>
          <CardDescription>
            Create a new pizza type to categorize recipes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Pizza Type Name"
              value={newPizzaType.name}
              onChange={(e) =>
                setNewPizzaType({ ...newPizzaType, name: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={newPizzaType.description}
              onChange={(e) =>
                setNewPizzaType({ ...newPizzaType, description: e.target.value })
              }
            />
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Pizza Type
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pizzaTypes?.map((type) => (
          <Card key={type.id} className="group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{type.name}</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(type)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this pizza type?")) {
                        deleteMutation.mutate(type.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {type.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {type.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Pizza Type</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                placeholder="Name"
                value={editingType?.name || ""}
                onChange={(e) =>
                  setEditingType(
                    editingType ? { ...editingType, name: e.target.value } : null
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Editor
                content={editingType?.description || ""}
                onChange={(content) =>
                  setEditingType(
                    editingType ? { ...editingType, description: content } : null
                  )
                }
              />
            </div>
            <div className="grid gap-2">
              <Input
                placeholder="Image URL"
                value={editingType?.image_url || ""}
                onChange={(e) =>
                  setEditingType(
                    editingType ? { ...editingType, image_url: e.target.value } : null
                  )
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
};

export default PizzaTypeManagement;