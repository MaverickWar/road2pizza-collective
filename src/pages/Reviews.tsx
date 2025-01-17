import { useState } from "react";
import Navigation from "@/components/Navigation";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewContent from "@/components/reviews/ReviewContent";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

const Reviews = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hiddenElements, setHiddenElements] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="min-h-screen bg-admin-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-admin to-admin-secondary/50 text-white">
        <div className="container mx-auto px-4 py-16 pt-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Technology Reviews</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Expert insights and hands-on experiences with the latest tech equipment and gadgets.
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-16 z-10 bg-white border-b border-admin-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-2xl w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search reviews..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              <Button 
                onClick={handleNewReview}
                className="bg-admin hover:bg-admin-hover text-white flex-1 md:flex-none"
              >
                Write a Review
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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