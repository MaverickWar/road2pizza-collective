import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, BookOpen } from "lucide-react";

interface AuthorCardProps {
  author: {
    username: string;
    points?: number;
    badge_title?: string;
    badge_color?: string;
    recipes_shared?: number;
    created_at: string;
  };
}

const AuthorCard = ({ author }: AuthorCardProps) => {
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
      <CardContent className="grid grid-cols-3 gap-4 pt-4">
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
      </CardContent>
    </Card>
  );
};

export default AuthorCard;