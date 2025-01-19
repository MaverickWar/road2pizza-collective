import { Card } from "@/components/ui/card";
import { ReviewData } from "@/types/review";
import { format } from "date-fns";
import { Rating } from "@/components/Rating";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Package, DollarSign, Wrench, ThumbsUp, ThumbsDown } from "lucide-react";
import MediaGallery from "@/components/article/MediaGallery";
import AuthorBadges from "@/components/shared/AuthorBadges";

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
      {/* Title and Meta Section */}
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
        
        {/* Author Badges */}
        {review.created_by && (
          <AuthorBadges 
            userId={review.created_by} 
            className="mt-2"
          />
        )}
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

      {/* Pros/Cons and Ratings Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Pros and Cons */}
        <div className="space-y-6">
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

        {/* Right Column - Rating Categories */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-admin mb-2">{review.rating}/5</div>
            <Rating value={review.rating} className="justify-center" />
          </div>
          
          <div className="space-y-6">
            {ratingCategories.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-admin/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-admin" />
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Rating value={value || 0} />
                  <span className="font-bold text-admin">{value}/5</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Product Information */}
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