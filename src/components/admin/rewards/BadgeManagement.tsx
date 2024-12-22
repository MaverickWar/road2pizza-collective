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
import { Badge, Crown, Plus, Trash } from "lucide-react";

interface BadgeFormData {
  title: string;
  description: string;
  color: string;
  required_points: number;
  is_special: boolean;
}

const BadgeManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<BadgeFormData>({
    title: "",
    description: "",
    color: "#000000",
    required_points: 0,
    is_special: false,
  });

  const queryClient = useQueryClient();

  const { data: badges, isLoading } = useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      console.log("Fetching badges...");
      const { data, error } = await supabase
        .from("badges")
        .select("*")
        .order("required_points", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createBadgeMutation = useMutation({
    mutationFn: async (newBadge: BadgeFormData) => {
      const { data, error } = await supabase.from("badges").insert([newBadge]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge created successfully");
      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        color: "#000000",
        required_points: 0,
        is_special: false,
      });
    },
    onError: (error) => {
      console.error("Error creating badge:", error);
      toast.error("Failed to create badge");
    },
  });

  const deleteBadgeMutation = useMutation({
    mutationFn: async (badgeId: string) => {
      const { error } = await supabase
        .from("badges")
        .delete()
        .eq("id", badgeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting badge:", error);
      toast.error("Failed to delete badge");
    },
  });

  if (isLoading) {
    return <div>Loading badges...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Badge Management</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Badge
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Badge</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Required Points</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {badges?.map((badge) => (
            <TableRow key={badge.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: badge.color }}
                  />
                  <span>{badge.title}</span>
                </div>
              </TableCell>
              <TableCell>{badge.description}</TableCell>
              <TableCell>{badge.required_points}</TableCell>
              <TableCell>
                {badge.is_special ? (
                  <span className="flex items-center text-yellow-600">
                    <Crown className="w-4 h-4 mr-1" />
                    Special
                  </span>
                ) : (
                  <span className="flex items-center text-blue-600">
                    <Badge className="w-4 h-4 mr-1" />
                    Regular
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this badge?")) {
                      deleteBadgeMutation.mutate(badge.id);
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
            <DialogTitle>Create New Badge</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                />
                <div
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="required_points">Required Points</Label>
              <Input
                id="required_points"
                type="number"
                value={formData.required_points}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    required_points: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_special"
                checked={formData.is_special}
                onChange={(e) =>
                  setFormData({ ...formData, is_special: e.target.checked })
                }
              />
              <Label htmlFor="is_special">Special Badge</Label>
            </div>
            <Button
              className="w-full"
              onClick={() => createBadgeMutation.mutate(formData)}
            >
              Create Badge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BadgeManagement;