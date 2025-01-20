import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import BasicInfoSection from "./form/BasicInfoSection";
import MediaSection from "./form/MediaSection";
import RatingSection from "./form/RatingSection";
import ProsCons from "./form/ProsCons";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import FormNavigation from "./form/FormNavigation";
import FormActions from "./form/FormActions";
import { useForm } from "react-hook-form";
import { ReviewFormData } from "@/types/review";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: ReviewFormData = {
  title: "",
  brand: "",
  category: "",
  content: "",
  imageUrl: "",
  additionalImages: [],
  videoUrl: "",
  videoProvider: "",
  pros: [""],
  cons: [""],
  rating: 5,
  durability_rating: 5,
  value_rating: 5,
  ease_of_use_rating: 5,
};

const ReviewForm = ({ isOpen, onClose }: ReviewFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const form = useForm<ReviewFormData>({
    defaultValues: initialFormData
  });

  const handleSubmit = async (values: ReviewFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting review with data:", values);
      
      const { error } = await supabase.from("equipment_reviews").insert({
        title: values.title,
        brand: values.brand,
        category: values.category,
        content: values.content,
        image_url: values.imageUrl,
        images: values.additionalImages,
        video_url: values.videoUrl,
        video_provider: values.videoProvider,
        pros: values.pros.filter(Boolean),
        cons: values.cons.filter(Boolean),
        rating: values.rating,
        durability_rating: values.durability_rating,
        value_rating: values.value_rating,
        ease_of_use_rating: values.ease_of_use_rating,
        created_by: user?.id,
        author: user?.username || "Anonymous",
        is_published: false
      });

      if (error) throw error;

      toast.success("Review submitted successfully");
      onClose();
      form.reset(initialFormData);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col max-w-4xl h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Create New Review</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <FormNavigation activeTab={activeTab} />

          <div className="flex-1 overflow-y-auto">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6 pb-24">
              <TabsContent value="basic" className="mt-0 space-y-6">
                <BasicInfoSection form={form} />
              </TabsContent>

              <TabsContent value="media" className="mt-0 space-y-6">
                <MediaSection form={form} />
              </TabsContent>

              <TabsContent value="proscons" className="mt-0 space-y-6">
                <ProsCons form={form} />
              </TabsContent>

              <TabsContent value="ratings" className="mt-0 space-y-6">
                <RatingSection form={form} />
              </TabsContent>
            </form>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-card border-t p-4 flex justify-end gap-2">
            <FormActions 
              onClose={onClose}
              onSubmit={form.handleSubmit(handleSubmit)}
              isSubmitting={isSubmitting}
            />
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;