import { Badge, Crown, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BadgeData {
  id: string;
  title: string;
  description: string;
  color: string;
  required_points: number;
  is_special: boolean;
  image_url?: string;
}

interface BadgeListProps {
  badges: BadgeData[];
  onDelete: (id: string) => void;
}

const BadgeList = ({ badges, onDelete }: BadgeListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Badge</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Required Points</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {badges?.map((badge) => (
          <TableRow key={badge.id}>
            <TableCell>
              <div className="flex items-center space-x-2">
                {badge.image_url ? (
                  <img
                    src={badge.image_url}
                    alt={badge.title}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: badge.color }}
                  />
                )}
                <span>{badge.title}</span>
              </div>
            </TableCell>
            <TableCell>{badge.description}</TableCell>
            <TableCell>{badge.required_points}</TableCell>
            <TableCell>
              {badge.is_special ? (
                <span className="flex items-center text-yellow-600">
                  <Crown className="w-4 h-4 mr-1" />
                  Special
                </span>
              ) : (
                <span className="flex items-center text-blue-600">
                  <Badge className="w-4 h-4 mr-1" />
                  Regular
                </span>
              )}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this badge?")) {
                    onDelete(badge.id);
                  }
                }}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BadgeList;