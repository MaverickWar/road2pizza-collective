import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ReviewData } from '@/types/review';

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
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="h-4 bg-secondary rounded w-1/4"></div>
            <div className="h-[300px] bg-secondary rounded"></div>
          </div>
        </div>
      </>
    );
  }

  if (!review) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Review not found</h1>
            <Button
              variant="ghost"
              onClick={() => navigate('/reviews')}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Reviews
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Type guard to ensure pros and cons are string arrays
  const prosArray = Array.isArray(review.pros) ? review.pros as string[] : [];
  const consArray = Array.isArray(review.cons) ? review.cons as string[] : [];

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

        <Card className="max-w-4xl mx-auto">
          {review.image_url && (
            <div className="relative h-[400px] overflow-hidden rounded-t-lg">
              <img
                src={review.image_url}
                alt={review.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardHeader className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{review.title}</h1>
                <p className="text-muted-foreground">by {review.author}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-xl font-semibold">{review.rating}/5</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{review.category}</Badge>
              <Badge variant="outline">{review.brand}</Badge>
              {review.model && (
                <Badge variant="outline">Model: {review.model}</Badge>
              )}
              {review.price_range && (
                <Badge variant="outline">Price: {review.price_range}</Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {review.content && (
              <div className="prose dark:prose-invert max-w-none">
                <p>{review.content}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {review.durability_rating && (
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Durability</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">
                      {review.durability_rating}/5
                    </span>
                  </div>
                </div>
              )}

              {review.value_rating && (
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">
                      {review.value_rating}/5
                    </span>
                  </div>
                </div>
              )}

              {review.ease_of_use_rating && (
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">Ease of Use</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-medium">
                      {review.ease_of_use_rating}/5
                    </span>
                  </div>
                </div>
              )}
            </div>

            {(prosArray.length > 0 || consArray.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prosArray.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Pros</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {prosArray.map((pro: string, index: number) => (
                        <li key={index} className="text-green-500">
                          <span className="text-foreground">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {consArray.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cons</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {consArray.map((con: string, index: number) => (
                        <li key={index} className="text-red-500">
                          <span className="text-foreground">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EquipmentReviewDetail;