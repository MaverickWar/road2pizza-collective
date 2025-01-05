import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { ReviewData } from '@/types/review';

interface ReviewContentProps {
  review: ReviewData;
}

export const ReviewContent = ({ review }: ReviewContentProps) => {
  const prosArray = Array.isArray(review.pros) ? review.pros as string[] : [];
  const consArray = Array.isArray(review.cons) ? review.cons as string[] : [];

  return (
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
  );
};