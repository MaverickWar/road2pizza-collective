import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, Trash2, Users } from "lucide-react";
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
          className="rounded-lg border p-4 space-y-4"
          style={{ backgroundColor: badge.color }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <h3 className="font-semibold">{badge.title}</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedBadge(badge)}
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(badge.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm">{badge.description}</p>
          <div className="text-sm">Required Points: {badge.required_points}</div>
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