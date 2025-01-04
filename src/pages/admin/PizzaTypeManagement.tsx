import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pizza, Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

      if (error) throw error;
      return data;
    },
  });

  const handleAddPizzaType = async () => {
    try {
      if (!newPizzaType.name.trim()) {
        toast.error("Pizza type name is required");
        return;
      }

      const { error } = await supabase.from("pizza_types").insert({
        name: newPizzaType.name.trim(),
        description: newPizzaType.description.trim(),
        slug: newPizzaType.name.toLowerCase().replace(/\s+/g, "-"),
      });

      if (error) throw error;

      toast.success("Pizza type added successfully");
      setNewPizzaType({ name: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["pizza-types"] });
    } catch (error) {
      console.error("Error adding pizza type:", error);
      toast.error("Failed to add pizza type");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-secondary/50 rounded-lg" />
        <div className="h-20 bg-secondary/50 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pizza className="w-5 h-5" />
            Add New Pizza Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Button onClick={handleAddPizzaType} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Pizza Type
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {pizzaTypes?.map((type) => (
          <Card key={type.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{type.name}</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
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