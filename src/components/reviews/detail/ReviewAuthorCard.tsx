import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Trophy, BookOpen } from "lucide-react";
import AuthorBadges from "@/components/shared/AuthorBadges";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReviewAuthorCardProps {
  authorId: string;
  authorName: string;
  createdAt: string;
}

const ReviewAuthorCard = ({ authorId, authorName, createdAt }: ReviewAuthorCardProps) => {
  const { data: authorProfile } = useQuery({
    queryKey: ['author-profile', authorId],
    queryFn: async () => {
      console.log('Fetching author profile:', authorId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authorId)
        .single();

      if (error) {
        console.error('Error fetching author profile:', error);
        throw error;
      }

      console.log('Fetched author profile:', data);
      return data;
    },
    enabled: !!authorId
  });

  if (!authorProfile) {
    return null;
  }

  return (
    <Card className="bg-card hover:bg-card-hover transition-colors">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-12 w-12">
          {authorProfile.avatar_url ? (
            <AvatarImage 
              src={authorProfile.avatar_url} 
              alt={authorName}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link 
            to={`/community/profile/${authorProfile.username}`}
            className="text-lg font-semibold hover:text-accent transition-colors"
          >
            {authorName}
          </Link>
          <p className="text-sm text-muted-foreground">
            Member since {format(new Date(authorProfile.created_at), 'MMMM yyyy')}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {authorProfile.points !== undefined && (
            <div className="flex flex-col items-center">
              <Trophy className="h-5 w-5 text-highlight mb-1" />
              <span className="text-sm font-medium">{authorProfile.points}</span>
              <span className="text-xs text-muted-foreground">Points</span>
            </div>
          )}
          {authorProfile.recipes_shared !== undefined && (
            <div className="flex flex-col items-center">
              <BookOpen className="h-5 w-5 text-accent mb-1" />
              <span className="text-sm font-medium">{authorProfile.recipes_shared}</span>
              <span className="text-xs text-muted-foreground">Recipes</span>
            </div>
          )}
        </div>

        {authorProfile.bio && (
          <p className="text-sm text-muted-foreground border-t pt-4">
            {authorProfile.bio}
          </p>
        )}

        <AuthorBadges userId={authorId} className="mt-4" />
      </CardContent>
    </Card>
  );
};

export default ReviewAuthorCard;