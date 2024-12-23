import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import Editor from '@/components/Editor';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  is_solution: boolean;
  user: {
    username: string;
  };
}

interface Thread {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by: string;
  is_locked: boolean;
  category: {
    name: string;
  };
  posts: Post[];
}

const ThreadView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [replyContent, setReplyContent] = useState('');

  const { data: thread, isLoading, refetch } = useQuery({
    queryKey: ['thread', id],
    queryFn: async () => {
      console.log('Fetching thread:', id);
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          *,
          category:forum_categories(*),
          posts:forum_posts(
            *,
            user:profiles(username)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      console.log('Thread data:', data);
      return data as Thread;
    },
  });

  const handleReply = async () => {
    if (!user) {
      toast.error('You must be logged in to reply');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('forum_posts')
        .insert({
          thread_id: id,
          content: replyContent,
          created_by: user.id,
        });

      if (error) throw error;

      toast.success('Reply posted successfully');
      setReplyContent('');
      // Refresh the thread data to show the new reply
      refetch();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 bg-secondary/50 animate-pulse rounded-lg w-1/4"></div>
          <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Thread not found</h2>
          <Button
            onClick={() => navigate('/community')}
            className="mt-4"
          >
            Return to Community
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Thread Header */}
        <div>
          <h1 className="text-3xl font-bold">{thread.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <span>Category: {thread.category?.name}</span>
            {thread.is_locked && (
              <span className="text-destructive">🔒 Locked</span>
            )}
          </div>
        </div>

        {/* Original Post */}
        <div className="bg-card p-6 rounded-lg">
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: thread.content }} />
        </div>

        {/* Replies */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Replies
          </h2>
          
          {thread.posts?.length > 0 ? (
            thread.posts.map((post) => (
              <div key={post.id} className="bg-card p-6 rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{post.user?.username || 'Unknown User'}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-card rounded-lg">
              No replies yet. Be the first to reply!
            </div>
          )}
        </div>

        {/* Reply Form */}
        {!thread.is_locked && user && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Post Reply</h3>
            <Editor content={replyContent} onChange={setReplyContent} />
            <Button onClick={handleReply}>Post Reply</Button>
          </div>
        )}

        {thread.is_locked && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
            This thread is locked and cannot receive new replies
          </div>
        )}

        {!user && (
          <div className="bg-card p-4 rounded-lg text-center">
            Please log in to reply to this thread
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadView;