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

  const { data: review, isLoading } = useQuery({
    queryKey: ['equipment-review', id],
    queryFn: async () => {
      console.log('Fetching equipment review:', id);
      const { data, error } = await supabase
        .from('equipment_reviews')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching equipment review:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Review not found');
      }

      return data as ReviewData;
    },
  });

  if (isLoading) {
    return <ReviewLoading />;
  }

  if (!review) {
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