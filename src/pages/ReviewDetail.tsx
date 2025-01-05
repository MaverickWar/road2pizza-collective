import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { ReviewContent } from "@/components/reviews/detail/ReviewContent";
import { ReviewError } from "@/components/reviews/detail/ReviewError";
import { ReviewData } from "@/types/review";

const ReviewDetail = () => {
  const { id } = useParams();
  console.log("Fetching review with ID:", id);

  const { data: review, isLoading, error } = useQuery({
    queryKey: ['review', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_reviews')
        .select(`
          *,
          profiles:created_by (username)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching review:", error);
        throw error;
      }

      console.log("Fetched review data:", data);
      
      // Cast the data to match ReviewData type
      const reviewData: ReviewData = {
        ...data,
        pros: Array.isArray(data.pros) ? data.pros : [],
        cons: Array.isArray(data.cons) ? data.cons : [],
      };

      return reviewData;
    },
  });

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </>
    );
  }

  if (error || !review) {
    return <ReviewError />;
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <ReviewContent review={review} />
      </div>
    </>
  );
};

export default ReviewDetail;