import { Card } from "@/components/ui/card";
import { ReviewData } from "@/types/review";
import { format } from "date-fns";

interface ReviewContentProps {
  review: ReviewData;
}

export const ReviewContent = ({ review }: ReviewContentProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{review.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>By {review.author}</span>
          <span>•</span>
          <span>{format(new Date(review.created_at), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      {/* Main Image */}
      {review.image_url && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <img
            src={review.image_url}
            alt={review.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* Rating Overview */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">Product Details</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-muted-foreground">Brand</dt>
                <dd>{review.brand}</dd>
              </div>
              {review.model && (
                <div>
                  <dt className="text-muted-foreground">Model</dt>
                  <dd>{review.model}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd>{review.category}</dd>
              </div>
              {review.price_range && (
                <div>
                  <dt className="text-muted-foreground">Price Range</dt>
                  <dd>{review.price_range}</dd>
                </div>
              )}
            </dl>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Ratings</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-muted-foreground">Overall Rating</dt>
                <dd>{review.rating}/5</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Durability</dt>
                <dd>{review.durability_rating}/5</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Value</dt>
                <dd>{review.value_rating}/5</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Ease of Use</dt>
                <dd>{review.ease_of_use_rating}/5</dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>

      {/* Review Content */}
      {review.content && (
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mb-4">Review</h2>
          <div className="whitespace-pre-wrap">{review.content}</div>
        </div>
      )}

      {/* Pros & Cons */}
      {(review.pros || review.cons) && (
        <div className="grid gap-6 md:grid-cols-2">
          {review.pros && review.pros.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-green-600">Pros</h3>
              <ul className="list-disc pl-4 space-y-2">
                {review.pros.map((pro, index) => (
                  <li key={index}>{pro}</li>
                ))}
              </ul>
            </Card>
          )}
          {review.cons && review.cons.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-red-600">Cons</h3>
              <ul className="list-disc pl-4 space-y-2">
                {review.cons.map((con, index) => (
                  <li key={index}>{con}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};