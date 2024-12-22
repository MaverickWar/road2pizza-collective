import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReviewForm from "./ReviewForm";
import { toast } from "sonner";

const ReviewManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["equipment-reviews"],
    queryFn: async () => {
      console.log("Fetching equipment reviews...");
      const { data, error } = await supabase
        .from("equipment_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("equipment_reviews")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment-reviews"] });
      toast.success("Review deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (review: any) => {
    setEditingReview(review);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingReview(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingReview ? "Edit Review" : "Add New Review"}
              </DialogTitle>
            </DialogHeader>
            <ReviewForm
              review={editingReview}
              onSuccess={() => {
                setIsDialogOpen(false);
                setEditingReview(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews?.map((review) => (
            <TableRow key={review.id}>
              <TableCell>{review.title}</TableCell>
              <TableCell>{review.brand}</TableCell>
              <TableCell>{review.category}</TableCell>
              <TableCell>{review.rating}/5</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(review)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(review.id)}
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

export default ReviewManagement;