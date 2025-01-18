import { Card } from "@/components/ui/card";
import { ReviewData } from "@/types/review";
import { format } from "date-fns";
import { Rating } from "@/components/Rating";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Package, DollarSign, Wrench, ThumbsUp, ThumbsDown } from "lucide-react";
import MediaGallery from "@/components/article/MediaGallery";

interface ReviewContentProps {
  review: ReviewData;
}

export const ReviewContent = ({ review }: ReviewContentProps) => {
  const ratingCategories = [
    { label: "Overall", value: review.rating, icon: Star },
    { label: "Durability", value: review.durability_rating, icon: Wrench },
    { label: "Value", value: review.value_rating, icon: DollarSign },
    { label: "Ease of Use", value: review.ease_of_use_rating, icon: Package },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {review.is_featured && (
                <Badge variant="secondary" className="bg-admin/10 text-admin">
                  <Award className="w-4 h-4 mr-1" />
                  Featured Review
                </Badge>
              )}
              <Badge variant="outline">{review.category}</Badge>
            </div>
            <h1 className="text-4xl font-bold">{review.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>By {review.profiles?.username || review.author}</span>
              <span>•</span>
              <span>{format(new Date(review.created_at), 'MMMM d, yyyy')}</span>
            </div>
          </div>
          <div className="text-center bg-admin/10 p-4 rounded-lg">
            <div className="text-4xl font-bold text-admin mb-1">{review.rating}</div>
            <Rating value={review.rating} />
            <div className="text-sm text-muted-foreground mt-2">Overall Rating</div>
          </div>
        </div>

        {/* Key Points */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-secondary/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-green-600">
              <ThumbsUp className="w-5 h-5 mr-2" />
              Pros
            </h3>
            <ul className="space-y-2">
              {review.pros?.map((pro, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6 bg-secondary/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
              <ThumbsDown className="w-5 h-5 mr-2" />
              Cons
            </h3>
            <ul className="space-y-2">
              {review.cons?.map((con, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Media Gallery */}
      <Card className="overflow-hidden border-none shadow-lg">
        <MediaGallery 
          imageUrl={review.image_url} 
          images={review.images || []}
          videoUrl={review.video_url}
          videoProvider={review.video_provider}
        />
      </Card>

      {/* Detailed Ratings */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Detailed Ratings</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {ratingCategories.map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-admin/10">
                <Icon className="w-6 h-6 text-admin" />
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

      {/* Review Content */}
      {review.content && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Detailed Review</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{review.content}</div>
          </div>
        </Card>
      )}
    </div>
  );
};