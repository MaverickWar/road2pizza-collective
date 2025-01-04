import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pizza, Plus, Pencil, Trash2 } from "lucide-react";
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

const PizzaTypeManagement = () => {
  const [newPizzaType, setNewPizzaType] = useState({ name: "", description: "" });
  const queryClient = useQueryClient();

  const { data: pizzaTypes, isLoading } = useQuery({
    queryKey: ["pizza-types"],
    queryFn: async () => {
      console.log("Fetching pizza types...");
      const { data, error } = await supabase
        .from("pizza_types")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching pizza types:", error);
        throw error;
      }

      console.log("Fetched pizza types:", data);
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newType: typeof newPizzaType) => {
      const { data, error } = await supabase
        .from("pizza_types")
        .insert([
          {
            name: newType.name,
            description: newType.description,
            slug: newType.name.toLowerCase().replace(/\s+/g, "-"),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pizza-types"] });
      setNewPizzaType({ name: "", description: "" });
      toast.success("Pizza type created successfully");
    },
    onError: (error) => {
      console.error("Error creating pizza type:", error);
      toast.error("Failed to create pizza type");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pizza_types")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pizza-types"] });
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="h-20 bg-secondary/50 rounded-lg animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
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
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      // TODO: Implement edit functionality
                      toast.info("Edit functionality coming soon");
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this pizza type?")) {
                        deleteMutation.mutate(type.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
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
    </div>
  );
};

export default PizzaTypeManagement;