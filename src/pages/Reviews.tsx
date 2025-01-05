import { useState } from "react";
import Navigation from "@/components/Navigation";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewHeader from "@/components/reviews/ReviewHeader";
import ReviewContent from "@/components/reviews/ReviewContent";

const Reviews = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hiddenElements, setHiddenElements] = useState<string[]>([]);

  const toggleEditMode = (mode: boolean) => {
    setIsEditMode(mode);
  };

  const toggleElementVisibility = (elementId: string) => {
    if (!isEditMode) return;
    
    setHiddenElements(prev => 
      prev.includes(elementId) 
        ? prev.filter(id => id !== elementId)
        : [...prev, elementId]
    );
  };

  const handleNewReview = () => {
    setIsReviewFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <ReviewHeader 
          isEditMode={isEditMode}
          onEditModeChange={toggleEditMode}
        />
        
        <ReviewContent
          reviews={[]}
          isEditMode={isEditMode}
          hiddenElements={hiddenElements}
          onToggleVisibility={toggleElementVisibility}
          onNewReview={handleNewReview}
        />
      </main>

      <ReviewForm 
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
      />
    </div>
  );
};

export default Reviews;