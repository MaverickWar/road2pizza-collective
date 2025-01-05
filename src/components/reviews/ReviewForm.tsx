import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInfoSection from "./form/BasicInfoSection";
import MediaSection from "./form/MediaSection";
import RatingSection from "./form/RatingSection";
import ProsCons from "./form/ProsCons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ReviewFormData {
  title: string;
  brand: string;
  category: string;
  shortDescription: string;
  content: string;
  imageUrl: string;
  additionalImages: string[];
  videoUrl: string;
  videoProvider: string;
  pros: string[];
  cons: string[];
  ratings: {
    design: number;
    easeOfUse: number;
    portability: number;
    valueForMoney: number;
    reliability: number;
    descriptions: {
      design: string;
      easeOfUse: string;
      portability: string;
      valueForMoney: string;
      reliability: string;
    };
  };
}

const initialFormData: ReviewFormData = {
  title: "",
  brand: "",
  category: "",
  shortDescription: "",
  content: "",
  imageUrl: "",
  additionalImages: [],
  videoUrl: "",
  videoProvider: "",
  pros: [""],
  cons: [""],
  ratings: {
    design: 5,
    easeOfUse: 5,
    portability: 5,
    valueForMoney: 5,
    reliability: 5,
    descriptions: {
      design: "",
      easeOfUse: "",
      portability: "",
      valueForMoney: "",
      reliability: "",
    },
  },
};

const ReviewForm = ({ isOpen, onClose }: ReviewFormProps) => {
  const [formData, setFormData] = useState<ReviewFormData>(initialFormData);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const calculateOverallRating = () => {
    const { design, easeOfUse, portability, valueForMoney, reliability } = formData.ratings;
    return Math.round((design + easeOfUse + portability + valueForMoney + reliability) / 5);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log("Submitting review with data:", formData);
      
      const { error } = await supabase.from("equipment_reviews").insert({
        title: formData.title,
        brand: formData.brand,
        category: formData.category,
        content: formData.content,
        image_url: formData.imageUrl,
        images: formData.additionalImages,
        video_url: formData.videoUrl,
        video_provider: formData.videoProvider,
        pros: formData.pros.filter(Boolean),
        cons: formData.cons.filter(Boolean),
        rating: calculateOverallRating(),
        durability_rating: Math.round(formData.ratings.reliability),
        value_rating: Math.round(formData.ratings.valueForMoney),
        ease_of_use_rating: Math.round(formData.ratings.easeOfUse),
        created_by: user?.id,
        author: user?.username || "Anonymous"
      });

      if (error) throw error;

      toast.success("Review submitted successfully");
      onClose();
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Review</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="proscons">Pros & Cons</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoSection 
              formData={formData} 
              setFormData={setFormData} 
            />
          </TabsContent>

          <TabsContent value="media">
            <MediaSection 
              formData={formData} 
              setFormData={setFormData} 
            />
          </TabsContent>

          <TabsContent value="proscons">
            <ProsCons 
              formData={formData} 
              setFormData={setFormData} 
            />
          </TabsContent>

          <TabsContent value="ratings">
            <RatingSection 
              formData={formData} 
              setFormData={setFormData} 
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;