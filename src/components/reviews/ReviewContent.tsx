import { Card, CardContent } from "@/components/ui/card";
import ReviewCard from "./ReviewCard";
import { cn } from "@/lib/utils";
import ReviewStats from "./ReviewStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Grid2X2, Grid3X3, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ReviewContentProps {
  reviews: any[];
  isEditMode: boolean;
  hiddenElements: string[];
  onToggleVisibility: (elementId: string) => void;
  onNewReview: () => void;
}

const ReviewContent = ({ 
  reviews, 
  isEditMode, 
  hiddenElements,
  onToggleVisibility,
  onNewReview
}: ReviewContentProps) => {
  const [gridLayout, setGridLayout] = useState<'2x2' | '3x3'>('3x3');
  const isElementVisible = (elementId: string) => !hiddenElements.includes(elementId);

  // Get featured reviews
  const { data: featuredReviews = [] } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: async () => {
      console.log("Fetching featured reviews");
      const { data, error } = await supabase
        .from('equipment_reviews')
        .select(`
          *,
          profiles:created_by (username)
        `)
        .eq('is_featured', true)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching featured reviews:", error);
        throw error;
      }

      console.log("Fetched featured reviews:", data);
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Get top 10 reviews by rating
  const { data: topReviews = [] } = useQuery({
    queryKey: ['top-reviews'],
    queryFn: async () => {
      console.log("Fetching top reviews");
      const { data, error } = await supabase
        .from('equipment_reviews')
        .select(`
          *,
          profiles:created_by (username)
        `)
        .eq('is_published', true)
        .order('rating', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching top reviews:", error);
        throw error;
      }

      console.log("Fetched top reviews:", data);
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Get latest admin reviews
  const { data: adminReviews = [] } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      console.log("Fetching admin reviews");
      const { data: adminProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_admin', true);

      if (profileError) throw profileError;

      const adminIds = adminProfiles.map(profile => profile.id);
      
      const { data: reviews, error } = await supabase
        .from('equipment_reviews')
        .select(`
          *,
          profiles:created_by (username)
        `)
        .in('created_by', adminIds)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("Fetched admin reviews:", reviews);
      return reviews || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <div className="space-y-8">
      {isElementVisible('stats') && (
        <div 
          onClick={() => isEditMode && onToggleVisibility('stats')}
          className={cn(
            isEditMode && "cursor-pointer hover:opacity-50"
          )}
        >
          <ReviewStats reviews={reviews} onNewReview={onNewReview} />
        </div>
      )}

      <div className="flex justify-end gap-2 pb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setGridLayout('2x2')}
          className={cn(
            "w-10 h-10",
            gridLayout === '2x2' && "bg-admin/10 text-admin"
          )}
        >
          <Grid2X2 className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setGridLayout('3x3')}
          className={cn(
            "w-10 h-10",
            gridLayout === '3x3' && "bg-admin/10 text-admin"
          )}
        >
          <Grid3X3 className="h-5 w-5" />
        </Button>
      </div>

      {isElementVisible('featured-reviews') && featuredReviews.length > 0 && (
        <div 
          onClick={() => isEditMode && onToggleVisibility('featured-reviews')}
          className={cn(
            isEditMode && "cursor-pointer hover:opacity-50"
          )}
        >
          <Card className="border-none bg-highlight shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Featured Reviews</h2>
                <Columns3 className="h-5 w-5 text-admin" />
              </div>
              <div className={cn(
                "grid gap-6",
                gridLayout === '2x2' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}>
                {featuredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isElementVisible('top-reviews') && topReviews.length > 0 && (
        <div 
          onClick={() => isEditMode && onToggleVisibility('top-reviews')}
          className={cn(
            isEditMode && "cursor-pointer hover:opacity-50"
          )}
        >
          <Card className="border-none shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Top Rated Reviews</h2>
                <Columns3 className="h-5 w-5 text-admin" />
              </div>
              <div className={cn(
                "grid gap-6",
                gridLayout === '2x2' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}>
                {topReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isElementVisible('latest-reviews') && adminReviews.length > 0 && (
        <div 
          onClick={() => isEditMode && onToggleVisibility('latest-reviews')}
          className={cn(
            isEditMode && "cursor-pointer hover:opacity-50"
          )}
        >
          <Card className="border-none shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">Latest Reviews</h2>
                <Columns3 className="h-5 w-5 text-admin" />
              </div>
              <div className={cn(
                "grid gap-6",
                gridLayout === '2x2' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              )}>
                {adminReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReviewContent;