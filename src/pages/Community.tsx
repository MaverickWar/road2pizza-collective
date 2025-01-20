import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UserStats from "@/components/community/UserStats";
import Leaderboard from "@/components/community/Leaderboard";
import ForumCategories from "@/components/community/ForumCategories";
import { useQuery } from "@tanstack/react-query";

const Community = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    points: 0,
    badge_count: 0,
    recipes_shared: 0,
    rank: 0,
  });

  const { data: leaderboard = [], isError: isLeaderboardError } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
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
      return data || [];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    meta: {
      errorMessage: "Failed to load leaderboard. Please try refreshing the page."
    }
  });

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

  useEffect(() => {
    console.log("Community page mounted, auth state:", user);
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  if (isLeaderboardError) {
    toast.error("Failed to load leaderboard. Please try refreshing the page.");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-36 md:pt-32">
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
      </div>
    </div>
  );
};

export default Community;