import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReviewData } from '@/types/review';
import { ReviewLoading } from './detail/ReviewLoading';
import { ReviewError } from './detail/ReviewError';
import { ReviewContent } from './detail/ReviewContent';

const EquipmentReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log('Review ID from params:', id);

  const { data: review, isLoading, error } = useQuery({
    queryKey: ['equipment-review', id],
    queryFn: async () => {
      console.log('Starting to fetch equipment review with ID:', id);
      
      const { data, error } = await supabase
        .from('equipment_reviews')
        .select(`
          id,
          title,
          author,
          brand,
          model,
          category,
          price_range,
          content,
          rating,
          durability_rating,
          value_rating,
          ease_of_use_rating,
          created_at,
          image_url,
          is_featured,
          pros,
          cons,
          created_by,
          profiles:created_by (username)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching equipment review:', error);
        throw error;
      }

      if (!data) {
        console.log('No review found for ID:', id);
        throw new Error('Review not found');
      }

      console.log('Successfully fetched review data:', data);
      return data as ReviewData;
    },
    enabled: !!id,
  });

  console.log('Query state:', { isLoading, error, review });

  if (isLoading) {
    return <ReviewLoading />;
  }

  if (error || !review) {
    console.error('Error or no review:', error);
    return <ReviewError />;
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/reviews')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reviews
        </Button>

        <ReviewContent review={review} />
      </div>
    </>
  );
};

export default EquipmentReviewDetail;