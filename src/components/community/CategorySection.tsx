import { Button } from '@/components/ui/button';
import ThreadItem from './ThreadItem';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Editor from '@/components/Editor';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CategorySectionProps {
  category: {
    id: string;
    name: string;
    description: string | null;
    forum_threads: Array<{
      id: string;
      title: string;
      content: string;
      is_pinned: boolean;
      is_locked: boolean;
      posts: any[];
    }>;
  };
  onThreadCreated: () => void;
}

const CategorySection = ({ category, onThreadCreated }: CategorySectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const { user } = useAuth();

  const handleCreateThread = async () => {
    try {
      const { error } = await supabase
        .from('forum_threads')
        .insert([
          {
            title: newThread.title,
            content: newThread.content,
            category_id: category.id,
            created_by: user?.id,
          },
        ]);

      if (error) throw error;

      toast.success('Thread created successfully');
      setIsCreateDialogOpen(false);
      setNewThread({ title: '', content: '' });
      onThreadCreated();
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-purple-900">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-purple-700 mt-1">{category.description}</p>
            )}
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="bg-purple-100 hover:bg-purple-200 text-purple-900">
                New Thread
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Thread</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Thread Title"
                  value={newThread.title}
                  onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                />
                <div className="min-h-[200px]">
                  <Editor
                    content={newThread.content}
                    onChange={(content) => setNewThread({ ...newThread, content })}
                  />
                </div>
                <Button onClick={handleCreateThread} className="w-full">
                  Create Thread
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {category.forum_threads?.map((thread) => (
            <ThreadItem key={thread.id} thread={thread} />
          ))}
          {category.forum_threads?.length === 0 && (
            <p className="text-center py-4 text-gray-500 bg-white/50 rounded-lg">
              No threads yet. Be the first to start a discussion!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;