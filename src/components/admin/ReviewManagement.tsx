import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import ReviewForm from "./ReviewForm";
import { toast } from "sonner";
import ReviewStats from "./reviews/ReviewStats";
import ReviewFilters from "./reviews/ReviewFilters";
import ReviewTable from "./reviews/ReviewTable";

const ReviewManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["equipment-reviews"],
    queryFn: async () => {
      console.log("Fetching pizza oven reviews...");
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

  const filteredReviews = reviews?.filter((review) => {
    const matchesSearch = 
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || review.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(reviews?.map(review => review.category) || [])];
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / totalReviews || 0;
  const featuredReviews = reviews.filter(review => review.is_featured).length;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4 md:p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-20 bg-secondary rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-secondary rounded-lg" />
              ))}
            </div>
            <div className="h-96 bg-secondary rounded-lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Pizza Oven Reviews</h1>
          <p className="text-muted-foreground">
            Manage and monitor pizza oven reviews across the platform
          </p>
        </div>

        <ReviewStats
          totalReviews={totalReviews}
          averageRating={averageRating}
          featuredReviews={featuredReviews}
        />

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <ReviewFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                  categories={categories}
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingReview(null)} className="w-full sm:w-auto">
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

              <ReviewTable
                reviews={filteredReviews}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewManagement;