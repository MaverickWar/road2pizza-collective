import { Button } from '@/components/ui/button';
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
import ThreadList from './ThreadList';
import ThreadPagination from './ThreadPagination';

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
      created_at: string;
    }>;
  };
  onThreadCreated: () => void;
}

const THREADS_PER_PAGE = 5;

const CategorySection = ({ category, onThreadCreated }: CategorySectionProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const [currentPage, setCurrentPage] = useState(1);
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

  // Get pinned and unpinned threads
  const pinnedThreads = category.forum_threads
    .filter(thread => thread.is_pinned)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const unpinnedThreads = category.forum_threads
    .filter(thread => !thread.is_pinned)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Calculate remaining slots for unpinned threads based on pinned threads (only on first page)
  const remainingSlots = currentPage === 1 
    ? Math.max(0, THREADS_PER_PAGE - pinnedThreads.length)
    : THREADS_PER_PAGE;
  
  // Calculate total pages based on unpinned threads
  const totalPages = Math.ceil(unpinnedThreads.length / THREADS_PER_PAGE) || 1;
  
  // Ensure currentPage is within bounds
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
  
  // Get current page threads
  const startIndex = (currentPage - 1) * THREADS_PER_PAGE;
  const endIndex = startIndex + remainingSlots;
  const currentUnpinnedThreads = unpinnedThreads.slice(startIndex, endIndex);
  
  // Combine threads based on current page
  const displayThreads = currentPage === 1
    ? [...pinnedThreads, ...currentUnpinnedThreads]
    : currentUnpinnedThreads;

  return (
    <Card className="overflow-hidden">
      <div className="p-6 bg-card border-b border-border">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-foreground">
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
              <p className="text-sm text-muted-foreground mt-1">
                {category.description}
              </p>
            )}
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="bg-secondary hover:bg-secondary-hover text-secondary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                <span className="sm:inline hidden">New Thread</span>
                <span className="sm:hidden inline">New</span>
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
                <Button onClick={handleCreateThread} className="w-full">
                  Create Thread
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ThreadList 
        threads={displayThreads}
        showAdminControls={isAdmin}
        onThreadUpdated={onThreadCreated}
      />

      <ThreadPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
};

export default CategorySection;