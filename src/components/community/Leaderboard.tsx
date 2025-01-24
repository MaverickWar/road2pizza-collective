import { Button } from "@/components/ui/button";
import LeaderboardEntry from "./LeaderboardEntry";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  leaderboard: Array<{
    id: string;
    username: string;
    points: number;
    badge_count: number;
    recipes_shared: number;
    is_admin?: boolean;
    is_staff?: boolean;
    badge_title?: string;
    badge_color?: string;
    avatar_url?: string;
  }>;
  isAuthenticated: boolean;
}

const Leaderboard = ({ leaderboard, isAuthenticated }: LeaderboardProps) => {
  // Split leaderboard into top 3 and rest
  const topThree = leaderboard.slice(0, 3);
  const restOfBoard = leaderboard.slice(3, 10);

  return (
    <div className="bg-[#FEC6A1] p-4 rounded-lg">
      <div className="bg-secondary rounded-lg p-6">
        <h2 className="text-2xl font-bold text-textLight mb-6 text-center">Leaderboard</h2>
        
        {leaderboard.length > 0 ? (
          <div className="space-y-8">
            {/* Top 3 Section */}
            <div className="flex justify-center items-end gap-4 mb-8">
              {/* Second Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-orange-300 overflow-hidden">
                      <img
                        src={topThree[1].avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].username}`}
                        alt={topThree[1].username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium truncate max-w-[80px] text-center">
                    {topThree[1].username}
                  </p>
                  <p className="text-xs text-gray-600">{topThree[1].points} pts</p>
                </div>
              )}

              {/* First Place */}
              {topThree[0] && (
                <div className="flex flex-col items-center -mt-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden">
                      <img
                        src={topThree[0].avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].username}`}
                        alt={topThree[0].username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <svg className="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium truncate max-w-[80px] text-center">
                    {topThree[0].username}
                  </p>
                  <p className="text-xs text-gray-600">{topThree[0].points} pts</p>
                </div>
              )}

              {/* Third Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-orange-200 overflow-hidden">
                      <img
                        src={topThree[2].avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].username}`}
                        alt={topThree[2].username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium truncate max-w-[80px] text-center">
                    {topThree[2].username}
                  </p>
                  <p className="text-xs text-gray-600">{topThree[2].points} pts</p>
                </div>
              )}
            </div>

            {/* Rest of Leaderboard */}
            <div className="space-y-2">
              {restOfBoard.map((user, index) => (
                <LeaderboardEntry 
                  key={user.id} 
                  rank={index + 4} 
                  user={user}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-textLight">
            No community members found. Be the first to join!
          </div>
        )}
        
        {!isAuthenticated && (
          <div className="mt-8 text-center">
            <p className="text-textLight mb-4">Join our community to track your progress and earn rewards!</p>
            <Button asChild>
              <a href="/login">Sign In to Participate</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;