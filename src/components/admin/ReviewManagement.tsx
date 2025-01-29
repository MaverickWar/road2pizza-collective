import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import ReviewTable from "./reviews/ReviewTable";
import ReviewStats from "./reviews/ReviewStats";
import ReviewFilters from "./reviews/ReviewFilters";
import { toast } from "sonner";

const ReviewManagement = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['equipment-reviews'],
    queryFn: async () => {
      console.log("Fetching equipment reviews...");
      const { data, error } = await supabase
        .from('equipment_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
        throw error;
      }

      console.log("Fetched reviews:", data);
      return data || [];
    }
  });

  const totalReviews = reviews?.length || 0;
  const averageRating = reviews?.reduce((acc, review) => acc + (review.rating || 0), 0) / totalReviews || 0;
  const featuredReviews = reviews?.filter(review => review.is_featured)?.length || 0;

  const categories = [...new Set(reviews?.map(review => review.category) || [])];

  const handleEdit = async (review: any) => {
    console.log('Editing review:', review);
    // Implement edit functionality
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting review:', id);
      const { error } = await supabase
        .from('equipment_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Star className="w-6 h-6" />
            Review Management
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Review Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewStats 
              totalReviews={totalReviews}
              averageRating={averageRating}
              featuredReviews={featuredReviews}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewFilters 
              searchTerm=""
              onSearchChange={() => {}}
              categoryFilter="all"
              onCategoryChange={() => {}}
              categories={categories}
            />
          </CardContent>
        </Card>

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
      </div>
    </DashboardLayout>
  );
};

export default ReviewManagement;