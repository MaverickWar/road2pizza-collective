import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, BookOpen, Crown, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AuthorCardProps {
  author: {
    username: string;
    points?: number;
    badge_title?: string;
    badge_color?: string;
    recipes_shared?: number;
    created_at: string;
    id: string;
  } | null;
}

const AuthorCard = ({ author }: AuthorCardProps) => {
  const { data: userBadges } = useQuery({
    queryKey: ['user-badges', author?.id],
    queryFn: async () => {
      if (!author?.id) return [];
      console.log('Fetching badges for user:', author.id);
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
        .eq('user_id', author.id);

      if (error) {
        console.error('Error fetching user badges:', error);
        throw error;
      }

      console.log('Fetched user badges:', data);
      return data?.map(item => item.badges) || [];
    },
    enabled: !!author?.id
  });

  if (!author) {
    return null;
  }

  return (
    <Card className="bg-card hover:bg-card-hover transition-colors">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{getInitials(author.username)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link 
            to={`/community/profile/${author.username}`}
            className="text-lg font-semibold hover:text-accent transition-colors"
          >
            {author.username}
          </Link>
          <p className="text-sm text-gray-500">
            Member since {format(new Date(author.created_at), 'MMMM yyyy')}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {author.points !== undefined && (
            <div className="flex flex-col items-center">
              <Trophy className="h-5 w-5 text-highlight mb-1" />
              <span className="text-sm font-medium">{author.points}</span>
              <span className="text-xs text-gray-500">Points</span>
            </div>
          )}
          {author.recipes_shared !== undefined && (
            <div className="flex flex-col items-center">
              <BookOpen className="h-5 w-5 text-accent mb-1" />
              <span className="text-sm font-medium">{author.recipes_shared}</span>
              <span className="text-xs text-gray-500">Recipes</span>
            </div>
          )}
          {author.badge_title && (
            <div className="flex flex-col items-center">
              <Award className="h-5 w-5 text-secondary mb-1" />
              <Badge 
                style={{ backgroundColor: author.badge_color || '#FFE4E7' }}
                className="text-xs"
              >
                {author.badge_title}
              </Badge>
            </div>
          )}
        </div>

        {/* Display user badges */}
        {userBadges && userBadges.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Badges</p>
            <div className="flex flex-wrap gap-2">
              {userBadges.map((badge: any) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 p-2 rounded-lg"
                  style={{ backgroundColor: `${badge.color}20` }}
                >
                  {badge.image_url ? (
                    <img
                      src={badge.image_url}
                      alt={badge.title}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-offset-2"
                      style={{ borderColor: badge.color }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-offset-2"
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthorCard;