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
      
      {/* Hero Section with improved design */}
      <div className="bg-gradient-to-r from-admin to-admin-secondary/50 text-white">
        <div className="max-w-[2000px] mx-auto px-6 md:px-8 lg:px-12 py-20 md:py-32">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-up">
              Technology Reviews
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed animate-fade-up delay-100">
              Discover in-depth analysis and expert insights on the latest tech equipment, 
              gadgets, and innovations that shape our digital world.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar with improved styling */}
      <div className="sticky top-16 z-10 bg-white border-b border-admin-border shadow-sm">
        <div className="max-w-[2000px] mx-auto px-6 md:px-8 lg:px-12 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-3xl w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Search reviews by title, category, or brand..."
                className="pl-12 py-6 text-lg w-full border-admin/20 focus:border-admin"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 py-6 px-6 text-base border-admin/20 hover:bg-admin/5"
              >
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </Button>
              <Button 
                onClick={handleNewReview}
                className="bg-admin hover:bg-admin-hover text-white flex-1 md:flex-none py-6 px-8 text-base font-medium"
              >
                Write a Review
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with improved spacing and width */}
      <main className="max-w-[2000px] mx-auto px-6 md:px-8 lg:px-12 py-12">
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