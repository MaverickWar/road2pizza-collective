import { Link } from "react-router-dom";
import { MessageSquare, Pin, Lock, Clock, Eye } from "lucide-react";
import { AdminControls } from "./AdminControls";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface ThreadItemProps {
  thread: {
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    category_id: string;
    forum_posts: any[];
    created_at: string;
    created_by: string;
    post_count: number;
    view_count: number;
    last_post_at: string;
    last_post_by: string;
    author?: {
      username: string;
      avatar_url?: string;
    };
    last_poster?: {
      username: string;
      avatar_url?: string;
    };
  };
  showAdminControls?: boolean;
  onThreadUpdated: () => void;
}

const ThreadItem = ({ thread, showAdminControls, onThreadUpdated }: ThreadItemProps) => {
  return (
    <div className="flex items-center gap-4 py-4 px-6 hover:bg-secondary/5 border-b border-border transition-colors">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={thread.author?.avatar_url} />
        <AvatarFallback>{getInitials(thread.author?.username || 'Unknown')}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            to={`/community/forum/thread/${thread.id}`}
            className="text-lg font-semibold hover:text-accent transition-colors line-clamp-1"
          >
            {thread.title}
          </Link>
          {thread.is_pinned && (
            <Badge variant="outline" className="text-accent">
              <Pin className="w-3 h-3 mr-1" />
              Pinned
            </Badge>
          )}
          {thread.is_locked && (
            <Badge variant="destructive" className="text-xs">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>by {thread.author?.username || 'Unknown'}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {format(new Date(thread.created_at), 'PP')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8 text-sm text-muted-foreground shrink-0">
        <div className="flex flex-col items-center">
          <span className="font-medium">{thread.view_count || 0}</span>
          <span className="text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" /> Views
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium">{thread.post_count || thread.forum_posts?.length || 0}</span>
          <span className="text-xs flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> Replies
          </span>
        </div>
      </div>

      {showAdminControls && (
        <div className="ml-4">
          <AdminControls
            categoryId={thread.category_id}
            threadId={thread.id}
            title={thread.title}
            content={thread.content}
            onUpdate={onThreadUpdated}
            type="thread"
          />
        </div>
      )}
    </div>
  );
};

export default ThreadItem;