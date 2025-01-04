import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { MoreHorizontal, Edit, Trash2, FolderInput, Lock, Pin, LockOpen } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import Editor from "@/components/Editor";

interface ThreadActionsProps {
  threadId: string;
  currentTitle: string;
  currentContent: string;
  currentCategoryId?: string;
  isPinned?: boolean;
  isLocked?: boolean;
  onThreadUpdated: () => void;
  isInManagement?: boolean;
}

export const ThreadActions = ({ 
  threadId, 
  currentTitle, 
  currentContent,
  currentCategoryId,
  isPinned = false,
  isLocked = false,
  onThreadUpdated,
  isInManagement = false 
}: ThreadActionsProps) => {
  const { isAdmin, isStaff } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(currentContent);
  const [selectedCategory, setSelectedCategory] = useState(currentCategoryId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["forum-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    }
  });

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

  const handleMove = async () => {
    try {
      const { error } = await supabase
        .from("forum_threads")
        .update({ category_id: selectedCategory })
        .eq("id", threadId);

      if (error) throw error;

      toast.success("Thread moved successfully");
      setIsMoveDialogOpen(false);
      onThreadUpdated();
    } catch (error) {
      console.error("Error moving thread:", error);
      toast.error("Failed to move thread");
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

  if (!isAdmin && !isStaff && !isInManagement) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTogglePin}
              className={isPinned ? "bg-accent/10" : ""}
            >
              <Pin className={`h-4 w-4 ${isPinned ? "fill-current" : ""}`} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleLock}
              className={isLocked ? "bg-accent/10" : ""}
            >
              {isLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <LockOpen className="h-4 w-4" />
              )}
            </Button>
          </>
        )}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setIsEditDialogOpen(true);
              setIsDropdownOpen(false);
            }}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Thread
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => {
              setIsMoveDialogOpen(true);
              setIsDropdownOpen(false);
            }}>
              <FolderInput className="w-4 h-4 mr-2" />
              Move Thread
            </DropdownMenuItem>

            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Thread
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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

      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Thread</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleMove}>Move Thread</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};