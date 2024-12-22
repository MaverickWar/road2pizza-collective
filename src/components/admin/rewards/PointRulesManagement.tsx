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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Star, Trash } from "lucide-react";

interface PointRuleFormData {
  action_type: string;
  description: string;
  points: number;
}

const PointRulesManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PointRuleFormData>({
    action_type: "",
    description: "",
    points: 0,
  });

  const queryClient = useQueryClient();

  const { data: pointRules, isLoading } = useQuery({
    queryKey: ["point-rules"],
    queryFn: async () => {
      console.log("Fetching point rules...");
      const { data, error } = await supabase
        .from("point_rules")
        .select("*")
        .order("points", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createPointRuleMutation = useMutation({
    mutationFn: async (newRule: PointRuleFormData) => {
      const { data, error } = await supabase.from("point_rules").insert([newRule]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["point-rules"] });
      toast.success("Point rule created successfully");
      setIsDialogOpen(false);
      setFormData({
        action_type: "",
        description: "",
        points: 0,
      });
    },
    onError: (error) => {
      console.error("Error creating point rule:", error);
      toast.error("Failed to create point rule");
    },
  });

  const deletePointRuleMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      const { error } = await supabase
        .from("point_rules")
        .delete()
        .eq("id", ruleId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["point-rules"] });
      toast.success("Point rule deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting point rule:", error);
      toast.error("Failed to delete point rule");
    },
  });

  if (isLoading) {
    return <div>Loading point rules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Point Rules Management</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pointRules?.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.action_type}</TableCell>
              <TableCell>{rule.description}</TableCell>
              <TableCell>
                <span className="flex items-center text-yellow-600">
                  <Star className="w-4 h-4 mr-1" />
                  {rule.points}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this rule?")) {
                      deletePointRuleMutation.mutate(rule.id);
                    }
                  }}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Point Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="action_type">Action Type</Label>
              <Input
                id="action_type"
                value={formData.action_type}
                onChange={(e) =>
                  setFormData({ ...formData, action_type: e.target.value })
                }
                placeholder="e.g., add_recipe, add_review"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="e.g., Points awarded for adding a new recipe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    points: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <Button
              className="w-full"
              onClick={() => createPointRuleMutation.mutate(formData)}
            >
              Create Rule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PointRulesManagement;