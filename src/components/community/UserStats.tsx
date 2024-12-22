import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Award, Pizza, Trophy } from "lucide-react";

interface UserStatsProps {
  stats: {
    points: number;
    badge_count: number;
    recipes_shared: number;
    rank: number;
  };
}

const UserStats = ({ stats }: UserStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-secondary">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-textLight">Your Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Star className="mr-2 h-4 w-4 text-yellow-500" />
            <span className="text-2xl font-bold text-textLight">{stats.points}</span>
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
            <span className="text-2xl font-bold text-textLight">{stats.badge_count}</span>
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
            <span className="text-2xl font-bold text-textLight">{stats.recipes_shared}</span>
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
            <span className="text-2xl font-bold text-textLight">#{stats.rank}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;