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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  console.log('Total threads:', category.forum_threads.length);

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

  // Sort threads by created_at date (newest first) and separate pinned threads
  const sortedThreads = [...category.forum_threads].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  // Separate pinned and unpinned threads
  const pinnedThreads = sortedThreads.filter(thread => thread.is_pinned);
  const unpinnedThreads = sortedThreads.filter(thread => !thread.is_pinned);

  console.log('Pinned threads:', pinnedThreads.length);
  console.log('Unpinned threads:', unpinnedThreads.length);

  // Calculate pagination
  const totalPages = Math.ceil(unpinnedThreads.length / THREADS_PER_PAGE);
  
  // Ensure currentPage is within bounds
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
  
  // Get current page threads
  const startIndex = (currentPage - 1) * THREADS_PER_PAGE;
  const endIndex = startIndex + THREADS_PER_PAGE;
  const currentUnpinnedThreads = unpinnedThreads.slice(startIndex, endIndex);
  
  console.log('Current page:', currentPage);
  console.log('Start index:', startIndex);
  console.log('End index:', endIndex);
  console.log('Current unpinned threads:', currentUnpinnedThreads.length);
  
  // Combine pinned threads with current page threads
  const displayThreads = [...pinnedThreads, ...currentUnpinnedThreads];
  
  console.log('Total display threads:', displayThreads.length);

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
                <Button onClick={handleCreateThread} className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-[#221F26] dark:hover:bg-[#1A1F2C]">
                  Create Thread
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="divide-y divide-orange-100 dark:divide-[#221F26]">
        {displayThreads.map((thread) => (
          <ThreadItem 
            key={thread.id} 
            thread={thread}
            showAdminControls={isAdmin}
            onThreadUpdated={onThreadCreated}
          />
        ))}
        {category.forum_threads.length === 0 && (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            No threads yet. Be the first to start a discussion!
          </p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="p-4 flex justify-center items-center gap-4">
          <Select
            value={currentPage.toString()}
            onValueChange={(value) => setCurrentPage(parseInt(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Page" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <SelectItem key={page} value={page.toString()}>
                  Page {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </Card>
  );
};

export default CategorySection;