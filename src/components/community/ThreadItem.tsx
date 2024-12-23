import { MessageSquare, Pin, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ThreadItemProps {
  thread: {
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    posts: any[];
  };
}

const ThreadItem = ({ thread }: ThreadItemProps) => {
  return (
    <Link
      to={`/community/forum/thread/${thread.id}`}
      className="block p-4 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/70 transition-all border border-purple-100 shadow-sm"
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
            <h4 className="font-medium text-gray-900 truncate">{thread.title}</h4>
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {thread.content}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
          <MessageSquare className="w-4 h-4" />
          <span>{thread.posts?.length || 0} replies</span>
        </div>
      </div>
    </Link>
  );
};

export default ThreadItem;