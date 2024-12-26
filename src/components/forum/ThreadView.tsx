import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import ThreadHeader from './ThreadHeader';
import ThreadContent from './ThreadContent';
import ThreadReplies from './ThreadReplies';
import ReplyForm from './ReplyForm';
import { Thread } from './types';
import { useState } from 'react';

interface ThreadViewProps {
  threadId?: string;
  inModal?: boolean;
}

const ThreadView = ({ threadId, inModal = false }: ThreadViewProps) => {
  const params = useParams();
  const id = threadId || params.id;
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
          forum:forums(
            id,
            title,
            category:forum_categories(
              id,
              name
            )
          ),
          posts:forum_posts(
            *,
            user:profiles(username)
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching thread:', error);
        throw error;
      }
      
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
      refetch();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  };

  if (isLoading) {
    return (
      <div className={`${inModal ? '' : 'container mx-auto px-4 py-8'}`}>
        <div className="space-y-4">
          <div className="h-8 bg-secondary/50 animate-pulse rounded-lg w-1/4"></div>
          <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className={`${inModal ? '' : 'container mx-auto px-4 py-8'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Thread not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`${inModal ? '' : 'container mx-auto px-4 py-8'}`}>
      <div className="space-y-8">
        <ThreadHeader thread={thread} />
        <ThreadContent content={thread.content} />
        <ThreadReplies posts={thread.posts} />

        {!thread.is_locked && user && (
          <ReplyForm
            content={replyContent}
            onChange={setReplyContent}
            onSubmit={handleReply}
          />
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