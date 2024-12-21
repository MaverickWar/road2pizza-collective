import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Star } from "lucide-react";
import { format } from "date-fns";

interface ReviewsManagementProps {
  reviews: any[];
  isLoading: boolean;
}

const ReviewsManagement = ({ reviews, isLoading }: ReviewsManagementProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-secondary/50 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Recipe</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell className="font-medium">{review.recipes?.title}</TableCell>
            <TableCell>{review.profiles?.username}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                {review.rating}
              </div>
            </TableCell>
            <TableCell>{format(new Date(review.created_at), "MMM d, yyyy")}</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReviewsManagement;