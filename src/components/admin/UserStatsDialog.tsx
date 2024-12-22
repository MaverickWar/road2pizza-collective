import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserStatsDialogProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UserStatsDialog = ({ user, open, onOpenChange, onSuccess }: UserStatsDialogProps) => {
  const [points, setPoints] = useState("");
  const [badgeTitle, setBadgeTitle] = useState("");
  const [badgeColor, setBadgeColor] = useState("");

  const handleUpdateUserStats = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          points: parseInt(points) || 0,
          badge_title: badgeTitle || null,
          badge_color: badgeColor || null,
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success("User stats updated successfully");
      onSuccess();
      onOpenChange(false);
      setPoints("");
      setBadgeTitle("");
      setBadgeColor("");
    } catch (error) {
      console.error("Error updating user stats:", error);
      toast.error("Failed to update user stats");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User Stats</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder={user?.points?.toString() || "0"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="badgeTitle">Badge Title</Label>
            <Input
              id="badgeTitle"
              value={badgeTitle}
              onChange={(e) => setBadgeTitle(e.target.value)}
              placeholder={user?.badge_title || "Enter badge title"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="badgeColor">Badge Color</Label>
            <div className="flex space-x-2">
              <Input
                id="badgeColor"
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value)}
                placeholder={user?.badge_color || "#000000"}
              />
              <div
                className="w-10 h-10 rounded border"
                style={{ backgroundColor: badgeColor || user?.badge_color || '#000000' }}
              />
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => handleUpdateUserStats(user.id)}
          >
            Update Stats
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserStatsDialog;