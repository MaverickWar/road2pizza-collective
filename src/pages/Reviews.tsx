import { useState } from "react";
import Navigation from "@/components/Navigation";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewHeader from "@/components/reviews/ReviewHeader";
import ReviewContent from "@/components/reviews/ReviewContent";

const Reviews = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const handleNewReview = () => {
    setIsReviewFormOpen(true);
  };


   return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-[5rem]">
        <ReviewHeader />
        
        <ReviewContent
          reviews={[]}
          onNewReview={handleNewReview}
        />
      </main>

      <ReviewForm 
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(true)}
      />
    </div>
  );
};

export default Reviews;
