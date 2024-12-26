import { MessageSquare, Pin, Lock, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface ThreadItemProps {
  thread: {
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    posts: any[];
    view_count?: number;
  };
}

const ThreadItem = ({ thread }: ThreadItemProps) => {
  const [likesCount, setLikesCount] = useState(0);
  const { user } = useAuth();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to like threads');
      return;
    }

    try {
      const { error } = await supabase
        .from('forum_threads')
        .update({ view_count: (thread.view_count || 0) + 1 })
        .eq('id', thread.id);

      if (error) throw error;
      setLikesCount(prev => prev + 1);
      toast.success('Thread liked!');
    } catch (error) {
      console.error('Error liking thread:', error);
      toast.error('Failed to like thread');
    }
  };

  return (
    <Link
      to={`/community/forum/thread/${thread.id}`}
      className="block hover:bg-orange-50/50 dark:hover:bg-[#221F26]/20 transition-colors"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {thread.is_pinned && (
                <Pin className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              )}
              {thread.is_locked && (
                <Lock className="w-4 h-4 text-red-500" />
              )}
              <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                {thread.title}
              </h4>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {thread.content.replace(/<[^>]*>/g, '')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-orange-600 dark:text-orange-400"
              onClick={handleLike}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likesCount}</span>
            </Button>
            <div className="flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap">
              <MessageSquare className="w-4 h-4" />
              <span>{thread.posts?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThreadItem;