import { Card } from "@/components/ui/card";
import { ReviewData } from "@/types/review";
import MediaGallery from "@/components/article/MediaGallery";
import ReviewAuthorCard from "./ReviewAuthorCard";
import { ReviewHeader } from "../sections/ReviewHeader";
import { ReviewRatings } from "../sections/ReviewRatings";
import { ReviewProsCons } from "../sections/ReviewProsCons";
import { ProductInfo } from "../sections/ProductInfo";

interface ReviewContentProps {
  review: ReviewData;
}

export const ReviewContent = ({ review }: ReviewContentProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ReviewHeader review={review} />

      {/* Author Card */}
      {review.created_by && (
        <ReviewAuthorCard 
          authorId={review.created_by}
          authorName={review.profiles?.username || review.author}
          createdAt={review.created_at}
        />
      )}

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
        <ReviewProsCons review={review} />
        <ReviewRatings review={review} />
      </div>

      <ProductInfo review={review} />

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