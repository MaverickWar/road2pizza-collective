import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Award, Crown, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuthorBadgesProps {
  userId: string;
  className?: string;
}

const AuthorBadges = ({ userId, className }: AuthorBadgesProps) => {
  const { data: userBadges } = useQuery({
    queryKey: ['user-badges', userId],
    queryFn: async () => {
      console.log('Fetching badges for user:', userId);
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          badges (
            id,
            title,
            description,
            color,
            image_url,
            is_special
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user badges:', error);
        throw error;
      }

      console.log('Fetched user badges:', data);
      return data?.map(item => item.badges) || [];
    },
    enabled: !!userId
  });

  if (!userBadges?.length) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {userBadges.map((badge: any) => (
        <div
          key={badge.id}
          className="flex items-center gap-2 p-2 rounded-lg transition-colors"
          style={{ backgroundColor: `${badge.color}20` }}
        >
          {badge.image_url ? (
            <img
              src={badge.image_url}
              alt={badge.title}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-offset-2"
              style={{ borderColor: badge.color }}
            />
          ) : (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-offset-2"
              style={{ 
                backgroundColor: `${badge.color}20`,
                borderColor: badge.color
              }}
            >
              {badge.is_special ? (
                <Crown className="w-4 h-4" style={{ color: badge.color }} />
              ) : (
                <Star className="w-4 h-4" style={{ color: badge.color }} />
              )}
            </div>
          )}
          <span className="text-sm font-medium">{badge.title}</span>
        </div>
      ))}
    </div>
  );
};

export default AuthorBadges;