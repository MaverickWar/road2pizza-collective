import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Pin, Lock, Unlock, MessageSquare } from 'lucide-react';

interface Thread {
  id: string;
  title: string;
  category_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  view_count: number;
  category: {
    name: string;
  };
}

const ThreadManagement = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      console.log('Fetching forum threads...');
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          *,
          category:forum_categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched threads:', data);
      setThreads(data || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
      toast.error('Failed to load threads');
    } finally {
      setLoading(false);
    }
  };

  const togglePinned = async (threadId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('forum_threads')
        .update({ is_pinned: !currentState })
        .eq('id', threadId);

      if (error) throw error;

      toast.success(`Thread ${currentState ? 'unpinned' : 'pinned'} successfully`);
      fetchThreads();
    } catch (error) {
      console.error('Error toggling pin status:', error);
      toast.error('Failed to update thread');
    }
  };

  const toggleLocked = async (threadId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('forum_threads')
        .update({ is_locked: !currentState })
        .eq('id', threadId);

      if (error) throw error;

      toast.success(`Thread ${currentState ? 'unlocked' : 'locked'} successfully`);
      fetchThreads();
    } catch (error) {
      console.error('Error toggling lock status:', error);
      toast.error('Failed to update thread');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thread Management</h1>
      
      <div className="space-y-4">
        {threads.map((thread) => (
          <div key={thread.id} className="bg-card p-6 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{thread.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span>Category: {thread.category?.name}</span>
                  <span>•</span>
                  <span>{thread.view_count} views</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePinned(thread.id, thread.is_pinned)}
                  className={thread.is_pinned ? 'text-accent' : ''}
                >
                  <Pin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLocked(thread.id, thread.is_locked)}
                  className={thread.is_locked ? 'text-destructive' : ''}
                >
                  {thread.is_locked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {threads.length === 0 && (
          <div className="text-center py-8 text-muted-foreground bg-card rounded-lg">
            No threads found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadManagement;