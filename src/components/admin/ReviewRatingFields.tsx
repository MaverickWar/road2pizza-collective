import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";

interface ReviewRatingFieldsProps {
  form: UseFormReturn<ReviewFormData>;
}

const ReviewRatingFields = ({ form }: ReviewRatingFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default ReviewRatingFields;