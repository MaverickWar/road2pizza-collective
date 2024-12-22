import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const reviewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price_range: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  rating: z.string().transform((val) => parseInt(val, 10)),
  durability_rating: z.string().transform((val) => parseInt(val, 10)),
  value_rating: z.string().transform((val) => parseInt(val, 10)),
  ease_of_use_rating: z.string().transform((val) => parseInt(val, 10)),
});

interface ReviewFormProps {
  review?: any;
  onSuccess: () => void;
}

const ReviewForm = ({ review, onSuccess }: ReviewFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: review?.title || "",
      brand: review?.brand || "",
      model: review?.model || "",
      category: review?.category || "",
      price_range: review?.price_range || "",
      content: review?.content || "",
      rating: review?.rating?.toString() || "5",
      durability_rating: review?.durability_rating?.toString() || "5",
      value_rating: review?.value_rating?.toString() || "5",
      ease_of_use_rating: review?.ease_of_use_rating?.toString() || "5",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof reviewSchema>) => {
      const reviewData = {
        ...values,
        author: "Admin", // You might want to get this from the current user
      };

      console.log("Saving review data:", reviewData); // Debug log

      if (review) {
        const { error } = await supabase
          .from("equipment_reviews")
          .update(reviewData)
          .eq("id", review.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("equipment_reviews")
          .insert(reviewData); // Remove the array wrapper
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

  const onSubmit = (values: z.infer<typeof reviewSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Range (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., $50-$100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Content</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Rating (1-5)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="1" max="5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="durability_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durability Rating (1-5)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="1" max="5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="value_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value Rating (1-5)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="1" max="5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ease_of_use_rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ease of Use Rating (1-5)</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="1" max="5" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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