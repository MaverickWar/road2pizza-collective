interface LeaderboardEntryProps {
  rank: number;
  user: {
    id: string;
    username: string;
    points: number;
    avatar_url?: string;
  };
}

const LeaderboardEntry = ({ rank, user }: LeaderboardEntryProps) => {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${rank === 6 ? 'bg-orange-400 text-white' : 'bg-white'}`}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium w-6">{rank}</span>
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium">{user.username}</span>
      </div>
      <span className="text-sm">{user.points} pts</span>
    </div>
  );
};

export default LeaderboardEntry;