import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Pizza, Award, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeaderboardUser {
  id: string;
  username: string;
  points: number;
  badge_count: number;
  recipes_shared: number;
}

const Community = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userStats, setUserStats] = useState({
    points: 0,
    badge_count: 0,
    recipes_shared: 0,
    rank: 0,
  });

  useEffect(() => {
    console.log("Auth state:", user); // Debug auth state
    fetchLeaderboard();
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      console.log("Fetching leaderboard..."); // Debug fetch start
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, points, badge_count, recipes_shared')
        .order('points', { ascending: false })
        .limit(10);

      console.log("Leaderboard data:", data); // Debug received data
      console.log("Leaderboard error:", error); // Debug any errors

      if (error) throw error;
      
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error("Failed to load leaderboard");
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      console.log("Fetching user stats for:", user.id); // Debug user stats fetch
      const { data, error } = await supabase
        .from('profiles')
        .select('points, badge_count, recipes_shared')
        .eq('id', user.id)
        .maybeSingle();

      console.log("User stats data:", data); // Debug user stats data
      console.log("User stats error:", error); // Debug user stats error

      if (error) throw error;

      // Get user's rank
      const { count: rankData, error: rankError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gt('points', data?.points || 0);

      if (rankError) throw rankError;

      setUserStats({
        points: data?.points || 0,
        badge_count: data?.badge_count || 0,
        recipes_shared: data?.recipes_shared || 0,
        rank: (rankData || 0) + 1,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error("Failed to load user statistics");
    }
  };

  // Debug render
  console.log("Current leaderboard state:", leaderboard);
  console.log("Current user stats:", userStats);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-textLight mb-8">Pizza Community</h1>
          
          {/* User Stats */}
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-secondary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-textLight">Your Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    <span className="text-2xl font-bold text-textLight">{userStats.points}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-textLight">Badges Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Award className="mr-2 h-4 w-4 text-purple-500" />
                    <span className="text-2xl font-bold text-textLight">{userStats.badge_count}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-textLight">Recipes Shared</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Pizza className="mr-2 h-4 w-4 text-accent" />
                    <span className="text-2xl font-bold text-textLight">{userStats.recipes_shared}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-textLight">Community Rank</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Trophy className="mr-2 h-4 w-4 text-highlight" />
                    <span className="text-2xl font-bold text-textLight">#{userStats.rank}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Leaderboard */}
          <div className="bg-secondary rounded-lg p-6">
            <h2 className="text-2xl font-bold text-textLight mb-6">Community Leaderboard</h2>
            {leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((leader, index) => (
                  <div
                    key={leader.id}
                    className="flex items-center justify-between bg-background/50 p-4 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-bold text-textLight min-w-[2rem]">
                        #{index + 1}
                      </span>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.username}`} />
                        <AvatarFallback>
                          <UserRound className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-textLight">{leader.username || 'Anonymous'}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {leader.badge_count} badges
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {leader.recipes_shared} recipes
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-textLight">{leader.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-textLight">
                No community members found. Be the first to join!
              </div>
            )}
          </div>

          {!user && (
            <div className="mt-8 text-center">
              <p className="text-textLight mb-4">Join our community to track your progress and earn rewards!</p>
              <Button asChild>
                <a href="/login">Sign In to Participate</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;