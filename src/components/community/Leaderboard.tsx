import { Crown } from "lucide-react";
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
  console.log("Rendering leaderboard with data:", leaderboard);
  
  // Split leaderboard into top 3 and rest
  const topThree = leaderboard.slice(0, 3);
  const restOfBoard = leaderboard.slice(3, 10);

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Leaderboard</h2>
      
      {leaderboard.length > 0 ? (
        <div className="space-y-8">
          {/* Top 3 Section */}
          <div className="flex justify-center items-end gap-4 mb-12">
            {/* Second Place */}
            {topThree[1] && (
              <div className="flex flex-col items-center -mt-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[#FFA500] overflow-hidden">
                    <img
                      src={topThree[1].avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].username}`}
                      alt={topThree[1].username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#FFA500] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
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
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400" />
                  <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden">
                    <img
                      src={topThree[0].avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].username}`}
                      alt={topThree[0].username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
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
              <div className="flex flex-col items-center -mt-8">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[#CD7F32] overflow-hidden">
                    <img
                      src={topThree[2].avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].username}`}
                      alt={topThree[2].username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#CD7F32] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
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
          <div className="space-y-2 bg-[#FEC6A1] rounded-xl p-4">
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
        <div className="text-center py-8 text-gray-500">
          No leaderboard data available
        </div>
      )}
    </div>
  );
};

export default Leaderboard;