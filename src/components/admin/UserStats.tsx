import { Star, Award } from "lucide-react";

interface UserStatsProps {
  points: number;
  badgeTitle?: string | null;
  badgeColor?: string | null;
}

const UserStats = ({ points, badgeTitle, badgeColor }: UserStatsProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <Star className="w-4 h-4 text-yellow-500" />
        <span>{points || 0} points</span>
      </div>
      {badgeTitle && (
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4" style={{ color: badgeColor || 'currentColor' }} />
          <span>{badgeTitle}</span>
        </div>
      )}
    </div>
  );
};

export default UserStats;