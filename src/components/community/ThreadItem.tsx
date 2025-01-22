import { Link } from "react-router-dom";
import { MessageSquare, Pin, Lock, Clock } from "lucide-react";
import { AdminControls } from "./AdminControls";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
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
    <Card className="p-4 hover:bg-secondary/5 transition-colors">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={thread.author?.avatar_url} />
          <AvatarFallback>{getInitials(thread.author?.username || 'Unknown')}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
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
            <Link
              to={`/community/forum/thread/${thread.id}`}
              className="text-lg font-semibold text-foreground hover:text-accent transition-colors line-clamp-1"
            >
              {thread.title}
            </Link>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {thread.content.replace(/<[^>]*>/g, '')}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              By {thread.author?.username || 'Unknown'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {format(new Date(thread.created_at), 'PP')}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {thread.post_count || thread.forum_posts?.length || 0} replies
            </span>
          </div>

          {thread.last_post_at && (
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
              <span>Last reply by {thread.last_poster?.username || 'Unknown'}</span>
              <span>•</span>
              <span>{format(new Date(thread.last_post_at), 'PP')}</span>
            </div>
          )}
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
    </Card>
  );
};

export default ThreadItem;