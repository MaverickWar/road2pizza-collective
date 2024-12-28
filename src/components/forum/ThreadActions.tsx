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
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { MoreHorizontal, Edit, Trash2, FolderInput } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import Editor from "@/components/Editor";

interface ThreadActionsProps {
  threadId: string;
  currentTitle: string;
  currentContent: string;
  currentCategoryId?: string;
  onThreadUpdated: () => void;
  isInManagement?: boolean;
}

export const ThreadActions = ({ 
  threadId, 
  currentTitle, 
  currentContent,
  currentCategoryId,
  onThreadUpdated,
  isInManagement = false 
}: ThreadActionsProps) => {
  const { isAdmin, isStaff } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(currentContent);
  const [selectedCategory, setSelectedCategory] = useState(currentCategoryId);

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

  if (!isAdmin && !isStaff && !isInManagement) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Thread
              </DropdownMenuItem>
            </DialogTrigger>
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
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <FolderInput className="w-4 h-4 mr-2" />
                Move Thread
              </DropdownMenuItem>
            </DialogTrigger>
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

          <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Thread
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};