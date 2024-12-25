import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Editor from '@/components/Editor';
import { toast } from 'sonner';
import { MessageSquare, Pin, Lock, Plus } from 'lucide-react';
import ForumLayout from './ForumLayout';
import ForumBreadcrumbs from './ForumBreadcrumbs';
import { Card } from '@/components/ui/card';

const CategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: threads, isLoading: threadsLoading } = useQuery({
    queryKey: ['category-threads', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          *,
          posts:forum_posts(*)
        `)
        .eq('category_id', id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCreateThread = async () => {
    if (!user) {
      toast.error('You must be logged in to create a thread');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('forum_threads')
        .insert([
          {
            title: newThread.title,
            content: newThread.content,
            category_id: id,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Thread created successfully');
      setIsCreateDialogOpen(false);
      setNewThread({ title: '', content: '' });
      navigate(`/community/forum/thread/${data.id}`);
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
    }
  };

  if (categoryLoading || threadsLoading) {
    return (
      <ForumLayout>
        <div className="space-y-4">
          <div className="h-8 bg-purple-100/50 animate-pulse rounded-lg w-1/4"></div>
          <div className="h-20 bg-purple-100/50 animate-pulse rounded-lg"></div>
          <div className="h-20 bg-purple-100/50 animate-pulse rounded-lg"></div>
        </div>
      </ForumLayout>
    );
  }

  return (
    <ForumLayout>
      <div className="space-y-6">
        <ForumBreadcrumbs items={[{ label: category?.name || 'Loading...' }]} />
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {category?.name}
            </h1>
            {category?.description && (
              <p className="text-purple-700/80 dark:text-purple-300/80 mt-2">
                {category.description}
              </p>
            )}
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
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
                <Button 
                  onClick={handleCreateThread} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Create Thread
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {!threads?.length ? (
            <Card className="p-8 text-center text-purple-700/80 dark:text-purple-300/80 bg-purple-50/50 dark:bg-purple-900/20">
              <p>No threads yet. Be the first to start a discussion!</p>
            </Card>
          ) : (
            threads.map((thread) => (
              <Card
                key={thread.id}
                className="p-6 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer border-purple-100 dark:border-purple-800"
                onClick={() => navigate(`/community/forum/thread/${thread.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {thread.is_pinned && (
                        <Pin className="w-4 h-4 text-purple-500" />
                      )}
                      {thread.is_locked && (
                        <Lock className="w-4 h-4 text-red-500" />
                      )}
                      <h3 className="font-medium text-purple-900 dark:text-purple-100 truncate">
                        {thread.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-purple-700/80 dark:text-purple-300/80 line-clamp-2">
                      {thread.content.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-600/80 dark:text-purple-400/80 whitespace-nowrap">
                    <MessageSquare className="w-4 h-4" />
                    <span>{thread.posts?.length || 0}</span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ForumLayout>
  );
};

export default CategoryView;