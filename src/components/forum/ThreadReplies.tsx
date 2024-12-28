import { Post } from './types';
import { MessageSquare } from 'lucide-react';

export interface ThreadRepliesProps {
  posts: Post[];
  threadId: string;
  onReplyAdded: () => void;
}

const ThreadReplies = ({ posts, threadId, onReplyAdded }: ThreadRepliesProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Replies
      </h2>
      
      {posts?.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="bg-card p-6 rounded-lg space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-medium">{post.user?.username || 'Unknown User'}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <div 
              className="prose prose-invert max-w-none" 
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground bg-card rounded-lg">
          No replies yet. Be the first to reply!
        </div>
      )}
    </div>
  );
};

export default ThreadReplies;