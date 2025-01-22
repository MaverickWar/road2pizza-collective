import { Link } from "react-router-dom";
import { MessageSquare, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

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
      is_admin?: boolean;
      is_staff?: boolean;
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
  const getUsernameStyle = (isAdmin?: boolean, isStaff?: boolean) => {
    if (isAdmin) return "font-bold text-red-500";
    if (isStaff) return "font-bold text-blue-500";
    return "text-gray-900 dark:text-gray-100";
  };

  return (
    <div className="group relative flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/5">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <Link
            to={`/community/forum/thread/${thread.id}`}
            className="text-lg font-semibold hover:text-accent transition-colors line-clamp-1"
          >
            {thread.title}
          </Link>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-2">
            by{" "}
            <span className={getUsernameStyle(thread.author?.is_admin, thread.author?.is_staff)}>
              {thread.author?.username || "Unknown"}
            </span>
          </span>
          <span className="text-muted-foreground">
            {format(new Date(thread.created_at), 'PP')}
          </span>
        </div>
      </div>

      <Separator orientation="vertical" className="h-12" />

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
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

      <Separator orientation="vertical" className="h-12" />

      <div className="flex flex-col items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src={thread.last_poster?.avatar_url} />
          <AvatarFallback>
            {thread.last_poster?.username?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(new Date(thread.last_post_at), 'PP')}
        </div>
      </div>
    </div>
  );
};

export default ThreadItem;