import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import Editor from '@/components/Editor';

interface AdminControlsProps {
  categoryId: string;
  threadId?: string;
  title: string;
  content?: string;
  onUpdate: () => void;
  type: 'category' | 'thread';
}

export const AdminControls = ({ categoryId, threadId, title, content, onUpdate, type }: AdminControlsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content || '');

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from(type === 'category' ? 'forum_categories' : 'forum_threads')
        .delete()
        .eq('id', type === 'category' ? categoryId : threadId);

      if (error) throw error;
      toast.success(`${type === 'category' ? 'Category' : 'Thread'} deleted successfully`);
      onUpdate();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from(type === 'category' ? 'forum_categories' : 'forum_threads')
        .update({
          title: editedTitle,
          ...(type === 'thread' && { content: editedContent }),
        })
        .eq('id', type === 'category' ? categoryId : threadId);

      if (error) throw error;
      toast.success(`${type === 'category' ? 'Category' : 'Thread'} updated successfully`);
      setIsEditOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating:', error);
      toast.error(`Failed to update ${type}`);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>
          <Edit className="h-4 w-4" />
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {type === 'category' ? 'Category' : 'Thread'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            {type === 'thread' && (
              <Editor
                content={editedContent}
                onChange={setEditedContent}
              />
            )}
            <Button onClick={handleEdit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="sm" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};