import { Card } from "@/components/ui/card";
import { ReviewData } from "@/types/review";

interface ProductInfoProps {
  review: ReviewData;
}

export const ProductInfo = ({ review }: ProductInfoProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Product Information</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <dl className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <dt className="text-muted-foreground">Brand</dt>
            <dd className="font-medium">{review.brand}</dd>
          </div>
          {review.model && (
            <div className="flex justify-between py-2 border-b">
              <dt className="text-muted-foreground">Model</dt>
              <dd className="font-medium">{review.model}</dd>
            </div>
          )}
          {review.price_range && (
            <div className="flex justify-between py-2 border-b">
              <dt className="text-muted-foreground">Price Range</dt>
              <dd className="font-medium">{review.price_range}</dd>
            </div>
          )}
        </dl>
      </div>
    </Card>
  );
};