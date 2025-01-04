import { Button } from '@/components/ui/button';
import ThreadItem from './ThreadItem';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Editor from '@/components/Editor';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AdminControls } from './AdminControls';

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
      category_id: string;
      forum_posts: any[];
    }>;
  };
  onThreadCreated: () => void;
}

const CategorySection = ({ category, onThreadCreated }: CategorySectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const { user, isAdmin } = useAuth();

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
    <Card className="overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-orange-100 to-orange-50 dark:from-[#221F26]/20 dark:to-[#1A1F2C]/20 border-b border-orange-100 dark:border-[#221F26]">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100">
                {category.name}
              </h3>
              {isAdmin && (
                <AdminControls
                  categoryId={category.id}
                  title={category.name}
                  onUpdate={onThreadCreated}
                  type="category"
                />
              )}
            </div>
            {category.description && (
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                {category.description}
              </p>
            )}
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="bg-orange-100 hover:bg-orange-200 text-orange-900 dark:bg-[#221F26] dark:hover:bg-[#1A1F2C] dark:text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Thread
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
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
                <Button onClick={handleCreateThread} className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-[#221F26] dark:hover:bg-[#1A1F2C]">
                  Create Thread
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="divide-y divide-orange-100 dark:divide-[#221F26]">
        {category.forum_threads?.map((thread) => (
          <ThreadItem 
            key={thread.id} 
            thread={thread}
            showAdminControls={isAdmin}
            onThreadUpdated={onThreadCreated}
          />
        ))}
        {category.forum_threads?.length === 0 && (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            No threads yet. Be the first to start a discussion!
          </p>
        )}
      </div>
    </Card>
  );
};

export default CategorySection;