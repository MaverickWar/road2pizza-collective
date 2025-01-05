import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReviewStats from "@/components/admin/reviews/ReviewStats";
import ReviewTable from "@/components/admin/reviews/ReviewTable";
import ReviewForm from "@/components/admin/ReviewForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const EquipmentReviewManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["equipment-reviews"],
    queryFn: async () => {
      console.log("Fetching equipment reviews...");
      const { data, error } = await supabase
        .from("equipment_reviews")
        .select(`
          *,
          profiles:created_by (
            username
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
      console.log("Fetched reviews:", data);
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting review:", id);
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

  const handleEdit = (review: any) => {
    setSelectedReview(review);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedReview(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalReviews = reviews?.length || 0;
  const averageRating = reviews?.reduce((acc: number, review: any) => acc + review.rating, 0) / totalReviews || 0;
  const featuredReviews = reviews?.filter((review: any) => review.is_featured).length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Equipment Reviews Management</h1>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Review
          </Button>
        </div>

        <ReviewStats
          totalReviews={totalReviews}
          averageRating={averageRating}
          featuredReviews={featuredReviews}
        />

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewTable
              reviews={reviews || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <ReviewForm
              review={selectedReview}
              onSuccess={handleFormClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default EquipmentReviewManagement;