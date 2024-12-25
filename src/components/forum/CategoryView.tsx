import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MessageSquare, Plus } from 'lucide-react';
import ForumLayout from './ForumLayout';
import ForumBreadcrumbs from './ForumBreadcrumbs';

interface Thread {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  created_by: string;
  posts: {
    id: string;
    content: string;
    created_at: string;
  }[];
}

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
      return data as Thread[];
    },
  });

  const handleCreateThread = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_threads')
        .insert([
          {
            title: newThread.title,
            content: newThread.content,
            category_id: id,
            created_by: user?.id,
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
          <div className="h-8 bg-secondary/50 animate-pulse rounded-lg w-1/4 mb-4"></div>
          <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
          <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-accent">{category?.name}</h1>
            {category?.description && (
              <p className="text-muted-foreground mt-2">{category.description}</p>
            )}
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent-hover text-white">
                <Plus className="w-4 h-4 mr-2" />
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
                <Textarea
                  placeholder="Thread Content"
                  value={newThread.content}
                  onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                  rows={5}
                />
                <Button onClick={handleCreateThread} className="w-full bg-accent hover:bg-accent-hover">
                  Create Thread
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {threads?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-card rounded-lg border border-border">
              No threads yet. Be the first to start a discussion!
            </div>
          ) : (
            threads?.map((thread) => (
              <div
                key={thread.id}
                className="p-6 bg-card hover:bg-card-hover border border-border rounded-lg transition-colors cursor-pointer"
                onClick={() => navigate(`/community/forum/thread/${thread.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold hover:text-accent transition-colors">
                      {thread.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {thread.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{thread.posts?.length || 0} posts</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ForumLayout>
  );
};

export default CategoryView;