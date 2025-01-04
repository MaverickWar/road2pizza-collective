import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { format } from "date-fns";

interface UserAvatarProps {
  user: any;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="flex items-center space-x-3 group">
          <img
            src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.username}
            className="w-10 h-10 rounded-full ring-2 ring-background transition-all group-hover:ring-accent/20"
          />
          <div className="text-left">
            <p className="font-medium group-hover:text-accent transition-colors">{user.username}</p>
            {user.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <img
              src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              alt={user.username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h4 className="text-sm font-semibold">{user.username}</h4>
              <p className="text-sm text-muted-foreground">
                Joined {format(new Date(user.created_at), "MMMM yyyy")}
              </p>
            </div>
          </div>
          {user.bio && (
            <p className="text-sm text-muted-foreground border-t pt-2">{user.bio}</p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserAvatar;