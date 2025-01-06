import { Card } from "@/components/ui/card";
import { ReviewData } from "@/types/review";
import { format } from "date-fns";
import { Rating } from "@/components/Rating";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Package, DollarSign, Tool } from "lucide-react";
import MediaGallery from "@/components/article/MediaGallery";

interface ReviewContentProps {
  review: ReviewData;
}

export const ReviewContent = ({ review }: ReviewContentProps) => {
  console.log('Rendering ReviewContent with data:', review);

  const ratingCategories = [
    { label: "Overall", value: review.rating, icon: Star },
    { label: "Durability", value: review.durability_rating, icon: Tool },
    { label: "Value", value: review.value_rating, icon: DollarSign },
    { label: "Ease of Use", value: review.ease_of_use_rating, icon: Package },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{review.title}</h1>
          {review.is_featured && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              Featured Review
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>By {review.profiles?.username || review.author}</span>
          <span>•</span>
          <span>{format(new Date(review.created_at), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      {/* Media Gallery */}
      <MediaGallery 
        imageUrl={review.image_url} 
        images={review.images || []}
        videoUrl={review.video_url}
        videoProvider={review.video_provider}
      />

      {/* Rating Overview */}
      <Card className="p-6 bg-card hover:bg-card-hover transition-colors">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ratingCategories.map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary">
                <Icon className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <Rating value={value || 0} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Product Details */}
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
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
              <div className="flex justify-between py-2 border-b">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">{review.category}</dd>
              </div>
              {review.price_range && (
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Price Range</dt>
                  <dd className="font-medium">{review.price_range}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Pros & Cons */}
          <div className="space-y-6">
            {review.pros && review.pros.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-green-600">Pros</h4>
                <ul className="space-y-2">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {review.cons && review.cons.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-red-600">Cons</h4>
                <ul className="space-y-2">
                  {review.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Review Content */}
      {review.content && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Detailed Review</h3>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{review.content}</div>
          </div>
        </Card>
      )}
    </div>
  );
};