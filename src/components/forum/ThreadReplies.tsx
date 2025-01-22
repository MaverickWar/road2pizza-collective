import { ForumPost } from "./types";

interface ThreadRepliesProps {
  posts: ForumPost[];
  threadId: string;
  onReplyAdded: () => void;
}

const ThreadReplies = ({ posts, threadId, onReplyAdded }: ThreadRepliesProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 border rounded-lg bg-card">
          <div className="flex items-center">
            <img
              src={post.user?.avatar_url || '/placeholder-avatar.png'}
              alt={post.user?.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-2">
              <p className="font-semibold">{post.user?.username}</p>
              <p className="text-sm text-muted-foreground">{post.created_at}</p>
            </div>
          </div>
          <p className="mt-2">{post.content}</p>
        </div>
      ))}
      <div className="mt-4">
        <button
          onClick={onReplyAdded}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default ThreadReplies;