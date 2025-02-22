
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UserStats from "@/components/community/UserStats";
import Leaderboard from "@/components/community/Leaderboard";
import ForumCategories from "@/components/community/ForumCategories";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Users } from "lucide-react";

const Community = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    points: 0,
    badge_count: 0,
    recipes_shared: 0,
    rank: 0,
  });

  const { data: onlineUsers = 0 } = useQuery({
    queryKey: ["online-users"],
    queryFn: async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', oneHourAgo.toISOString());
      return count || 0;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  const { data: leaderboard = [], isError: isLeaderboardError } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, points, badge_count, recipes_shared, is_admin, is_staff, badge_title, badge_color')
        .order('points', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    }
  });

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('points, badge_count, recipes_shared')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      const { count: rankData } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gt('points', data?.points || 0);

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
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-36 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-textLight">Pizza Community</h1>
              <p className="text-muted-foreground mt-2">
                Join the discussion, share your recipes, and connect with pizza enthusiasts
              </p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{onlineUsers} users online</span>
            </div>
          </div>
          
          {user && <UserStats stats={userStats} />}
          
          <Separator className="my-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ForumCategories />
            </div>
            <div className="space-y-8">
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
