import { Button } from "@/components/ui/button";
import LeaderboardEntry from "./LeaderboardEntry";

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
  }>;
  isAuthenticated: boolean;
}

const Leaderboard = ({ leaderboard, isAuthenticated }: LeaderboardProps) => {
  return (
    <div className="bg-[#FEC6A1] p-4 rounded-lg">
      <div className="bg-secondary rounded-lg p-6">
        <h2 className="text-2xl font-bold text-textLight mb-6">Community Leaderboard</h2>
        {leaderboard.length > 0 ? (
          <div className="space-y-4">
            {leaderboard.map((leader, index) => (
              <LeaderboardEntry 
                key={leader.id} 
                rank={index + 1} 
                user={leader} 
              />
            ))}
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