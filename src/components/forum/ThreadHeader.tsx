import { Thread } from './types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { Lock, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import UserRoleBadges from "@/components/admin/UserRoleBadges";
import UserStats from "@/components/admin/UserStats";

interface ThreadHeaderProps {
  thread: Thread;
}

const ThreadHeader = ({ thread }: ThreadHeaderProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">{thread.title}</h1>
        <div className="flex gap-2 shrink-0">
          {thread.is_pinned && (
            <Badge variant="secondary">
              Pinned Thread
            </Badge>
          )}
          {thread.password_protected && (
            <Badge variant="destructive">
              <Lock className="w-3 h-3 mr-1" />
              Password Protected
            </Badge>
          )}
          {thread.required_role && thread.required_role !== 'member' && (
            <Badge variant="outline">
              <Shield className="w-3 h-3 mr-1" />
              {thread.required_role.charAt(0).toUpperCase() + thread.required_role.slice(1)} Only
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-accent/5 rounded-lg">
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
        
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-lg">{thread.author?.username || 'Unknown User'}</p>
            <UserRoleBadges 
              isAdmin={thread.author?.is_admin || false}
              isStaff={thread.author?.is_staff || false}
            />
          </div>
          
          <UserStats 
            points={thread.author?.points || 0}
            badgeTitle={thread.author?.badge_title}
            badgeColor={thread.author?.badge_color}
          />
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{format(new Date(thread.created_at), 'PPp')}</span>
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