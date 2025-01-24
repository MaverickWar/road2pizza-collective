import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntryProps {
  rank: number;
  user: {
    id: string;
    username: string;
    points: number;
    is_admin?: boolean;
    is_staff?: boolean;
    avatar_url?: string;
  };
}

const LeaderboardEntry = ({ rank, user }: LeaderboardEntryProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium w-6">{rank}</span>
        <div className="relative">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
          {(user.is_admin || user.is_staff) && (
            <Shield 
              className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4",
                user.is_admin ? "text-admin" : "text-accent"
              )}
            />
          )}
        </div>
        <span className="font-medium text-sm">{user.username}</span>
      </div>
      <span className="text-sm text-gray-600">{user.points} pts</span>
    </div>
  );
};

export default LeaderboardEntry;