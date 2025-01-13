import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { MoreHorizontal, Edit, Trash2, Lock, LockOpen, Pin, Key } from "lucide-react";
import { useState } from "react";
import Editor from "@/components/Editor";
import { cn } from "@/lib/utils";

interface ThreadActionsProps {
  threadId: string;
  currentTitle: string;
  currentContent: string;
  currentCategoryId?: string;
  isPinned?: boolean;
  isLocked?: boolean;
  hasPassword?: boolean;
  onThreadUpdated: () => void;
  isInManagement?: boolean;
}

export const ThreadActions = ({ 
  threadId, 
  currentTitle, 
  currentContent,
  isPinned = false,
  isLocked = false,
  hasPassword = false,
  onThreadUpdated,
}: ThreadActionsProps) => {
  const { isAdmin } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(currentContent);
  const [password, setPassword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .delete()
        .eq("id", threadId);

      if (error) throw error;
      toast.success("Thread deleted successfully");
      onThreadUpdated();
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast.error("Failed to delete thread");
    }
  };

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({ content: editedContent })
        .eq("id", threadId);

      if (error) throw error;
      toast.success("Thread updated successfully");
      setIsEditDialogOpen(false);
      onThreadUpdated();
    } catch (error) {
      console.error("Error updating thread:", error);
      toast.error("Failed to update thread");
    }
  };

  const handleTogglePin = async () => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({ is_pinned: !isPinned })
        .eq("id", threadId);

      if (error) throw error;
      toast.success(`Thread ${isPinned ? 'unpinned' : 'pinned'} successfully`);
      onThreadUpdated();
    } catch (error) {
      console.error("Error toggling pin status:", error);
      toast.error("Failed to update pin status");
    }
  };

  const handleToggleLock = async () => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({ is_locked: !isLocked })
        .eq("id", threadId);

      if (error) throw error;
      toast.success(`Thread ${isLocked ? 'unlocked' : 'locked'} successfully`);
      onThreadUpdated();
    } catch (error) {
      console.error("Error toggling lock status:", error);
      toast.error("Failed to update lock status");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({ 
          password: password || null,
          password_protected: Boolean(password)
        })
        .eq("id", threadId);

      if (error) throw error;
      toast.success(password ? "Password updated successfully" : "Password removed successfully");
      setIsPasswordDialogOpen(false);
      setPassword("");
      onThreadUpdated();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleTogglePin}
        className={cn("transition-colors", isPinned && "bg-accent/10")}
        aria-label={isPinned ? "Unpin thread" : "Pin thread"}
      >
        <Pin className={cn("h-4 w-4", isPinned && "fill-current")} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleToggleLock}
        className={cn("transition-colors", isLocked && "bg-accent/10")}
        aria-label={isLocked ? "Unlock thread" : "Lock thread"}
      >
        {isLocked ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
      </Button>

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => {
            setIsEditDialogOpen(true);
            setIsDropdownOpen(false);
          }}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Thread
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => {
            setIsPasswordDialogOpen(true);
            setIsDropdownOpen(false);
          }}>
            <Key className="w-4 h-4 mr-2" />
            {hasPassword ? 'Edit Password' : 'Add Password'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-red-600"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Thread
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Thread</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Editor content={editedContent} onChange={setEditedContent} />
            <Button onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {hasPassword ? 'Edit Thread Password' : 'Add Thread Password'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between">
              <Button onClick={handlePasswordUpdate}>
                {password ? 'Save Password' : 'Remove Password'}
              </Button>
              {hasPassword && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setPassword('');
                    handlePasswordUpdate();
                  }}
                >
                  Remove Password
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
