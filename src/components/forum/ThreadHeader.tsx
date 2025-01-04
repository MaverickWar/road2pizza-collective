import { Thread } from './types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";

interface ThreadHeaderProps {
  thread: Thread;
}

const ThreadHeader = ({ thread }: ThreadHeaderProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{thread.title}</h1>
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          {thread.author?.avatar_url ? (
            <AvatarImage 
              src={thread.author.avatar_url} 
              alt={thread.author?.username || 'Unknown user'}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback>{getInitials(thread.author?.username || 'Unknown User')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{thread.author?.username || 'Unknown User'}</p>
          <p className="text-sm text-muted-foreground">
            Posted {format(new Date(thread.created_at), 'PPp')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Forum: {thread.forum?.title}</span>
        {thread.forum?.category && (
          <span>• Category: {thread.forum.category.name}</span>
        )}
        {thread.is_locked && (
          <span className="text-destructive">• 🔒 Locked</span>
        )}
      </div>
    </div>
  );
};

export default ThreadHeader;