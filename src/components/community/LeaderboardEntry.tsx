import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserRound, Star, Shield, UserCog } from 'lucide-react';

interface LeaderboardEntryProps {
  rank: number;
  user: {
    id: string;
    username: string;
    points: number;
    badge_count: number;
    recipes_shared: number;
    is_admin?: boolean;
    is_staff?: boolean;
    badge_title?: string;
    badge_color?: string;
  };
}

const LeaderboardEntry = ({ rank, user }: LeaderboardEntryProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between bg-background/50 p-4 rounded-lg gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-[200px]">
        <span className="text-xl font-bold text-textLight min-w-[2rem]">
          #{rank}
        </span>
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
            <AvatarFallback>
              <UserRound className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
            {user.is_admin && (
              <Badge variant="secondary" className="bg-red-100 text-red-700 whitespace-nowrap">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
            {!user.is_admin && user.is_staff && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 whitespace-nowrap">
                <UserCog className="w-3 h-3 mr-1" />
                Staff
              </Badge>
            )}
            {user.badge_title && (
              <Badge 
                variant="secondary" 
                className={`bg-${user.badge_color || 'gray'}-100 text-${user.badge_color || 'gray'}-700 whitespace-nowrap`}
              >
                {user.badge_title}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-[120px]">
          <p className="font-medium text-textLight mb-2">{user.username || 'Anonymous'}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {user.badge_count} badges
            </Badge>
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {user.recipes_shared} recipes
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Star className="h-4 w-4 text-yellow-500 shrink-0" />
        <span className="font-bold text-textLight">{user.points}</span>
      </div>
    </div>
  );
};

export default LeaderboardEntry;