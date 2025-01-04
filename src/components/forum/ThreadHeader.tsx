import { Thread } from './types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { Award, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ThreadHeaderProps {
  thread: Thread;
}

const ThreadHeader = ({ thread }: ThreadHeaderProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">{thread.title}</h1>
        {thread.is_pinned && (
          <Badge variant="secondary" className="shrink-0">
            Pinned Thread
          </Badge>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-accent/5 rounded-lg">
        <Avatar className="h-12 w-12 border-2 border-accent">
          {thread.author?.avatar_url ? (
            <AvatarImage 
              src={thread.author.avatar_url} 
              alt={thread.author?.username || 'Unknown user'}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback>{getInitials(thread.author?.username || 'Unknown User')}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-lg">{thread.author?.username || 'Unknown User'}</p>
            {thread.author?.badge_title && (
              <Badge variant="secondary" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                {thread.author.badge_title}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{format(new Date(thread.created_at), 'PPp')}</span>
            {thread.author?.points !== undefined && (
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {thread.author.points} points
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground border-t pt-4">
        <span>Forum: {thread.forum?.title}</span>
        {thread.forum?.category && (
          <span>• Category: {thread.forum.category.name}</span>
        )}
        {thread.is_locked && (
          <span className="text-destructive">• 🔒 Locked</span>
        )}
      </div>
    </Card>
  );
};

export default ThreadHeader;