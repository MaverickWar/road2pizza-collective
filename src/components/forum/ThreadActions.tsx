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
import { MoreHorizontal, Edit, Trash2, Key } from "lucide-react";
import { useState } from "react";
import Editor from "@/components/Editor";

interface ThreadActionsProps {
  threadId: string;
  currentTitle: string;
  currentContent: string;
  currentCategoryId?: string;
  isPinned?: boolean;
  isLocked?: boolean;
  hasPassword?: boolean;
  isInManagement?: boolean;
  onThreadUpdated: () => void;
}

export const ThreadActions = ({ 
  threadId, 
  currentTitle, 
  currentContent,
  currentCategoryId,
  isPinned = false,
  isLocked = false,
  hasPassword = false,
  isInManagement = false,
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

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 bg-background border border-border shadow-lg"
        >
          <DropdownMenuItem 
            onClick={() => {
              setIsEditDialogOpen(true);
              setIsDropdownOpen(false);
            }}
            className="flex items-center cursor-pointer"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Thread
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => {
              setIsPasswordDialogOpen(true);
              setIsDropdownOpen(false);
            }}
            className="flex items-center cursor-pointer"
          >
            <Key className="w-4 h-4 mr-2" />
            {hasPassword ? 'Manage Password' : 'Add Password'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleDelete}
            className="flex items-center cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Thread
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Thread</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Editor 
              content={editedContent} 
              onChange={setEditedContent}
              className="min-h-[200px] bg-background border border-input"
            />
            <Button onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {hasPassword ? 'Manage Thread Password' : 'Add Thread Password'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-input"
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