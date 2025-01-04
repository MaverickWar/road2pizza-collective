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
    forum_posts: any[];
  };
  showAdminControls?: boolean;
  onThreadUpdated: () => void;
}

const ThreadItem = ({ thread, showAdminControls, onThreadUpdated }: ThreadItemProps) => {
  return (
    <div className="p-4 hover:bg-accent/5 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {thread.is_pinned && (
              <Pin className="w-4 h-4 text-accent" />
            )}
            {thread.is_locked && (
              <Lock className="w-4 h-4 text-red-500" />
            )}
            <Link
              to={`/community/forum/thread/${thread.id}`}
              className="font-medium hover:text-accent transition-colors truncate"
            >
              {thread.title}
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {thread.content.replace(/<[^>]*>/g, '')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
            <MessageSquare className="w-4 h-4" />
            <span>{thread.forum_posts?.length || 0}</span>
          </div>
          {showAdminControls && (
            <AdminControls
              threadId={thread.id}
              title={thread.title}
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