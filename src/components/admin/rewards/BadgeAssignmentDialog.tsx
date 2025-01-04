import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface BadgeAssignmentDialogProps {
  badge: Tables<"badges">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BadgeAssignmentDialog = ({ badge, open, onOpenChange }: BadgeAssignmentDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      console.log("Fetching users for badge assignment...");
      const query = supabase
        .from("profiles")
        .select("id, username, badge_count")
        .order("username");

      if (searchQuery) {
        query.ilike("username", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const assignBadgeMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      console.log("Assigning badge to user:", userId);
      const { error } = await supabase
        .from("user_badges")
        .insert([{ user_id: userId, badge_id: badge.id }]);

      if (error) throw error;

      // Update badge count
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ badge_count: users?.find(u => u.id === userId)?.badge_count + 1 || 1 })
        .eq("id", userId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Badge assigned successfully");
    },
    onError: (error) => {
      console.error("Error assigning badge:", error);
      toast.error("Failed to assign badge");
    },
  });

  const removeBadgeMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      console.log("Removing badge from user:", userId);
      const { error } = await supabase
        .from("user_badges")
        .delete()
        .match({ user_id: userId, badge_id: badge.id });

      if (error) throw error;

      // Update badge count
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          badge_count: Math.max(0, users?.find(u => u.id === userId)?.badge_count - 1 || 0)
        })
        .eq("id", userId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Badge removed successfully");
    },
    onError: (error) => {
      console.error("Error removing badge:", error);
      toast.error("Failed to remove badge");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge className="h-4 w-4" />
            Manage Badge Assignments
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username..."
            />
          </div>
          <ScrollArea className="h-[300px] rounded-md border p-2">
            {isLoading ? (
              <div>Loading users...</div>
            ) : (
              <div className="space-y-2">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">
                        {user.badge_count || 0} badges
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          assignBadgeMutation.mutate({ userId: user.id });
                        }}
                      >
                        Assign
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          removeBadgeMutation.mutate({ userId: user.id });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeAssignmentDialog;