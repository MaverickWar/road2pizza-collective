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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
      setIsDeleteDialogOpen(false);
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
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => {
              setIsDeleteDialogOpen(true);
              setIsDropdownOpen(false);
            }}
            className="flex items-center cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Thread
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-background border-border max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Thread</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Editor 
              content={editedContent} 
              onChange={setEditedContent}
            />
            <Button onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Thread</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this thread? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};