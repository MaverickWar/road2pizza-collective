import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UserStats from "@/components/community/UserStats";
import Leaderboard from "@/components/community/Leaderboard";
import ForumCategories from "@/components/community/ForumCategories";

const Community = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState({
    points: 0,
    badge_count: 0,
    recipes_shared: 0,
    rank: 0,
  });

  useEffect(() => {
    console.log("Community page mounted, auth state:", user);
    fetchLeaderboard();
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      console.log("Fetching leaderboard data...");
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, points, badge_count, recipes_shared, is_admin, is_staff, badge_title, badge_color')
        .order('points', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
      }

      console.log("Leaderboard data fetched successfully:", data);
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      toast.error("Failed to load leaderboard");
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      console.log("Fetching user stats for:", user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('points, badge_count, recipes_shared')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user stats:', error);
        throw error;
      }

      // Get user's rank
      const { count: rankData, error: rankError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gt('points', data?.points || 0);

      if (rankError) {
        console.error('Error fetching user rank:', rankError);
        throw rankError;
      }

      console.log("User stats fetched successfully:", {
        stats: data,
        rank: rankData
      });

      setUserStats({
        points: data?.points || 0,
        badge_count: data?.badge_count || 0,
        recipes_shared: data?.recipes_shared || 0,
        rank: (rankData || 0) + 1,
      });
    } catch (error) {
      console.error('Failed to load user statistics:', error);
      toast.error("Failed to load user statistics");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-36 md:pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-textLight mb-8">Pizza Community</h1>
          
          {user && <UserStats stats={userStats} />}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <ForumCategories />
            </div>
            <div>
              <Leaderboard 
                leaderboard={leaderboard} 
                isAuthenticated={!!user} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;