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
  // Function to truncate username if longer than 14 characters
  const displayUsername = (username: string) => {
    if (username.length > 14) {
      return `${username.slice(0, 14)}...`;
    }
    return username;
  };

  return (
    <div className="flex items-center justify-between bg-background/50 p-4 rounded-lg gap-4">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <span className="text-xl font-bold text-textLight shrink-0 w-8">
          #{rank}
        </span>
        
        <div className="flex flex-col items-center gap-2 shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
            <AvatarFallback>
              <UserRound className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-wrap gap-1 justify-center">
            {user.is_admin && (
              <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs shrink-0">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            )}
            {!user.is_admin && user.is_staff && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs shrink-0">
                <UserCog className="w-3 h-3 mr-1" />
                Staff
              </Badge>
            )}
            {user.badge_title && (
              <Badge 
                variant="secondary" 
                className={`bg-${user.badge_color || 'gray'}-100 text-${user.badge_color || 'gray'}-700 text-xs shrink-0`}
              >
                {user.badge_title}
              </Badge>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-textLight">
            {displayUsername(user.username)}
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {user.badge_count} badges
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {user.recipes_shared} recipes
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Star className="h-4 w-4 text-yellow-500" />
        <span className="font-bold text-textLight">{user.points}</span>
      </div>
    </div>
  );
};

export default LeaderboardEntry;