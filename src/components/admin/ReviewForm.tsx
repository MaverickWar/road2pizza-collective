import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { reviewSchema, type ReviewData, type ReviewFormData } from "@/types/review";
import ReviewBasicFields from "./ReviewBasicFields";
import ReviewRatingFields from "./ReviewRatingFields";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ReviewFormProps {
  review?: ReviewData;
  onSuccess: () => void;
}

const ReviewForm = ({ review, onSuccess }: ReviewFormProps) => {
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
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ReviewFormData) => {
      console.log("Saving review data:", values);
      // Ensure all required fields are present
      const reviewData = {
        ...values,
        author: "Admin", // You might want to get this from the current user
        title: values.title,
        brand: values.brand,
        category: values.category,
        content: values.content,
        rating: values.rating,
        durability_rating: values.durability_rating,
        value_rating: values.value_rating,
        ease_of_use_rating: values.ease_of_use_rating,
        is_featured: values.is_featured,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ReviewBasicFields form={form} />
        <ReviewRatingFields form={form} />
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is_featured"
            checked={form.watch("is_featured")}
            onCheckedChange={(checked) => form.setValue("is_featured", checked)}
          />
          <Label htmlFor="is_featured">Feature in Top Reviews</Label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : review ? "Update Review" : "Create Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewForm;