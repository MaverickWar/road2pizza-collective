import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, Crown, Star, Trash2, Users } from "lucide-react";
import BadgeAssignmentDialog from "./BadgeAssignmentDialog";

interface BadgeListProps {
  badges: any[];
  onDelete: (id: string) => void;
}

const BadgeList = ({ badges, onDelete }: BadgeListProps) => {
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="relative group rounded-lg border p-4 space-y-4 hover:shadow-md transition-all duration-200"
          style={{ backgroundColor: `${badge.color}10` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {badge.image_url ? (
                <img
                  src={badge.image_url}
                  alt={badge.title}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2"
                  style={{ borderColor: badge.color }}
                />
              ) : badge.is_special ? (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-offset-2"
                  style={{ backgroundColor: `${badge.color}20`, borderColor: badge.color }}
                >
                  <Crown className="h-6 w-6" style={{ color: badge.color }} />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-offset-2"
                  style={{ backgroundColor: `${badge.color}20`, borderColor: badge.color }}
                >
                  <Star className="h-6 w-6" style={{ color: badge.color }} />
                </div>
              )}
              <div>
                <h3 className="font-semibold" style={{ color: badge.color }}>
                  {badge.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {badge.required_points} points required
                </p>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedBadge(badge)}
                className="h-8 w-8"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(badge.id)}
                className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {badge.description && (
            <p className="text-sm text-muted-foreground">{badge.description}</p>
          )}
        </div>
      ))}

      {selectedBadge && (
        <BadgeAssignmentDialog
          badge={selectedBadge}
          open={!!selectedBadge}
          onOpenChange={(open) => !open && setSelectedBadge(null)}
        />
      )}
    </div>
  );
};

export default BadgeList;