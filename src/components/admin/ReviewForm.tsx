import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { reviewSchema, type ReviewData, type ReviewFormData } from "@/types/review";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import BasicInfoSection from "./reviews/form/BasicInfoSection";
import MediaSection from "./reviews/form/MediaSection";
import RatingSection from "./reviews/form/RatingSection";
import ProsCons from "./reviews/form/ProsCons";

interface ReviewFormProps {
  review?: ReviewData;
  onSuccess: () => void;
}

const ReviewForm = ({ review, onSuccess }: ReviewFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const queryClient = useQueryClient();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: review?.title || "",
      brand: review?.brand || "",
      model: review?.model || "",
      category: review?.category || "",
      price_range: review?.price_range || "",
      content: review?.content || "",
      rating: review?.rating || 5,
      durability_rating: review?.durability_rating || 5,
      value_rating: review?.value_rating || 5,
      ease_of_use_rating: review?.ease_of_use_rating || 5,
      is_featured: review?.is_featured || false,
      imageUrl: review?.image_url || "",
      additionalImages: review?.images || [],
      videoUrl: review?.video_url || "",
      videoProvider: review?.video_provider || "",
      pros: review?.pros || [""],
      cons: review?.cons || [""],
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ReviewFormData) => {
      console.log("Saving review data:", values);
      const reviewData = {
        title: values.title,
        brand: values.brand,
        category: values.category,
        model: values.model,
        price_range: values.price_range,
        content: values.content,
        rating: values.rating,
        durability_rating: values.durability_rating,
        value_rating: values.value_rating,
        ease_of_use_rating: values.ease_of_use_rating,
        is_featured: values.is_featured,
        image_url: values.imageUrl,
        images: values.additionalImages,
        video_url: values.videoUrl,
        video_provider: values.videoProvider,
        pros: values.pros.filter(Boolean),
        cons: values.cons.filter(Boolean),
      };

      if (review?.id) {
        const { error } = await supabase
          .from("equipment_reviews")
          .update(reviewData)
          .eq("id", review.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("equipment_reviews")
          .insert(reviewData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment-reviews"] });
      toast.success(review ? "Review updated successfully" : "Review created successfully");
      onSuccess();
    },
    onError: (error) => {
      console.error("Error saving review:", error);
      toast.error("Failed to save review");
    },
  });

  const onSubmit = (values: ReviewFormData) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="proscons">Pros & Cons</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="basic">
              <BasicInfoSection form={form} />
            </TabsContent>

            <TabsContent value="media">
              <MediaSection form={form} />
            </TabsContent>

            <TabsContent value="ratings">
              <RatingSection form={form} />
            </TabsContent>

            <TabsContent value="proscons">
              <ProsCons form={form} />
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="bg-highlight hover:bg-highlight/90"
          >
            {mutation.isPending ? "Saving..." : review ? "Update Review" : "Create Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewForm;