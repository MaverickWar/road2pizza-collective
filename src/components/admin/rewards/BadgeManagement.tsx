import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import BadgeForm from "./BadgeForm";
import BadgeList from "./BadgeList";

const BadgeManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    mutationFn: async (newBadge: any) => {
      const { data, error } = await supabase.from("badges").insert([newBadge]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
      toast.success("Badge created successfully");
      setIsDialogOpen(false);
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

      <BadgeList badges={badges || []} onDelete={deleteBadgeMutation.mutate} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Badge</DialogTitle>
          </DialogHeader>
          <BadgeForm onSubmit={createBadgeMutation.mutate} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BadgeManagement;