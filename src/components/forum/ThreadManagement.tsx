import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Pin, Lock, Unlock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Thread } from './types';

const ThreadManagement = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

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
          forum:forums(
            id,
            title,
            category:forum_categories(
              id,
              name
            )
          ),
          posts:forum_posts(
            id,
            content,
            created_at,
            created_by,
            is_solution,
            user:profiles(username)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched threads:', data);
      setThreads(data as Thread[]);
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

  const toggleThreadExpansion = (threadId: string) => {
    setExpandedThreadId(expandedThreadId === threadId ? null : threadId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
              <div className="space-y-2 flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{thread.title}</h3>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleThreadExpansion(thread.id)}
                    >
                      {expandedThreadId === thread.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  {thread.forum && (
                    <>
                      <span>Forum: {thread.forum.title}</span>
                      <span>•</span>
                      <span>Category: {thread.forum.category?.name}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{thread.posts?.length || 0} posts</span>
                  <span>•</span>
                  <span>{thread.view_count} views</span>
                  <span>•</span>
                  <span>Created: {formatDate(thread.created_at)}</span>
                </div>
              </div>
            </div>

            {expandedThreadId === thread.id && thread.posts && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <h4 className="font-semibold">Posts</h4>
                {thread.posts.length > 0 ? (
                  thread.posts.map((post) => (
                    <div key={post.id} className="bg-muted/50 p-4 rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">
                          {post.user?.username || 'Unknown User'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <p className="text-sm">{post.content}</p>
                      {post.is_solution && (
                        <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
                          Solution
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No posts in this thread</p>
                )}
              </div>
            )}
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