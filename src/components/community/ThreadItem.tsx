import { Link } from "react-router-dom";
import { MessageSquare, Pin, Lock } from "lucide-react";
import { AdminControls } from "./AdminControls";

interface ThreadItemProps {
  thread: {
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    category_id: string;
    forum_posts: any[];
  };
  showAdminControls?: boolean;
  onThreadUpdated: () => void;
}

const ThreadItem = ({ thread, showAdminControls, onThreadUpdated }: ThreadItemProps) => {
  return (
    <div className="p-4 hover:bg-accent/5 dark:hover:bg-[#1A1F2C]/50 transition-colors border-b border-border dark:border-gray-800 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {thread.is_pinned && (
              <Pin className="w-4 h-4 text-accent dark:text-[#6E59A5]" />
            )}
            {thread.is_locked && (
              <Lock className="w-4 h-4 text-destructive" />
            )}
            <Link
              to={`/community/forum/thread/${thread.id}`}
              className="font-medium text-textLight dark:text-white hover:text-accent dark:hover:text-[#9b87f5] transition-colors truncate"
            >
              {thread.title}
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400 line-clamp-2">
            {thread.content.replace(/<[^>]*>/g, '')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-400 whitespace-nowrap">
            <MessageSquare className="w-4 h-4" />
            <span>{thread.forum_posts?.length || 0}</span>
          </div>
          {showAdminControls && (
            <AdminControls
              categoryId={thread.category_id}
              threadId={thread.id}
              title={thread.title}
              content={thread.content}
              onUpdate={onThreadUpdated}
              type="thread"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadItem;