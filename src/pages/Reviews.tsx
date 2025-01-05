import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewHeader from "@/components/reviews/ReviewHeader";
import ReviewContent from "@/components/reviews/ReviewContent";

const Reviews = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hiddenElements, setHiddenElements] = useState<string[]>([]);
  
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["pizza-oven-reviews"],
    queryFn: async () => {
      console.log("Fetching pizza oven reviews");
      const { data, error } = await supabase
        .from("equipment_reviews")
        .select(`
          *,
          profiles:created_by (username)
        `)
        .eq('category', 'Pizza Oven')
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
      return data;
    },
  });

  const toggleEditMode = (mode: boolean) => {
    setIsEditMode(mode);
    if (!mode) {
      toast.success("Layout saved!");
    } else {
      toast.info("Edit mode enabled. Click elements to show/hide them.");
    }
  };

  const toggleElementVisibility = (elementId: string) => {
    if (!isEditMode) return;
    
    setHiddenElements(prev => 
      prev.includes(elementId) 
        ? prev.filter(id => id !== elementId)
        : [...prev, elementId]
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <ReviewHeader 
          isEditMode={isEditMode}
          onEditModeChange={toggleEditMode}
        />
        
        <ReviewContent
          reviews={reviews || []}
          isEditMode={isEditMode}
          hiddenElements={hiddenElements}
          onToggleVisibility={toggleElementVisibility}
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