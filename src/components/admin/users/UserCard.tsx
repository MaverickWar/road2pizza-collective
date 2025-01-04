import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { format } from "date-fns";

interface UserCardProps {
  user: any;
  children: React.ReactNode;
}

const UserCard = ({ user, children }: UserCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-4 space-y-4 w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="flex items-center space-x-3">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="text-left">
                  <p className="font-medium">{user.username}</p>
                  {user.email && (
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  )}
                </div>
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{user.username}</h4>
                {user.bio && (
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Joined {format(new Date(user.created_at), "MMMM yyyy")}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        {children}
      </div>
    </div>
  );
};

export default UserCard;