import { Post } from './types';
import { MessageSquare, Pin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { format } from 'date-fns';

export interface ThreadRepliesProps {
  posts: Post[];
  threadId: string;
  onReplyAdded: () => void;
  onPinReply?: (postId: string) => void;
  isAdmin?: boolean;
}

const ThreadReplies = ({ posts, threadId, onReplyAdded, onPinReply, isAdmin }: ThreadRepliesProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Replies</h2>
      </div>
      
      <div className="space-y-4">
        {posts?.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user?.avatar_url} />
                  <AvatarFallback>{getInitials(post.user?.username || 'Unknown')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{post.user?.username || 'Unknown User'}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(post.created_at), 'PP')}
                      </span>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPinReply?.(post.id)}
                        className={post.is_pinned ? 'text-accent' : ''}
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div 
                    className="prose prose-sm prose-invert max-w-none mt-2" 
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                  />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              No replies yet. Be the first to reply!
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ThreadReplies;