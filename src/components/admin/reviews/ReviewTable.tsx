import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface Review {
  id: string;
  title: string;
  brand: string;
  category: string;
  rating: number;
}

interface ReviewTableProps {
  reviews: Review[];
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
}

const ReviewTable = ({ reviews, onEdit, onDelete }: ReviewTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell className="font-medium">{review.title}</TableCell>
              <TableCell>{review.brand}</TableCell>
              <TableCell>{review.category}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  {review.rating}/5
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(review)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(review.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReviewTable;