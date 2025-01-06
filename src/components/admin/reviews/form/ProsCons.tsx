import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";

interface ProsConsProps {
  form: UseFormReturn<ReviewFormData>;
}

const ProsCons = ({ form }: ProsConsProps) => {
  const addPro = () => {
    const currentPros = form.getValues("pros");
    form.setValue("pros", [...currentPros, ""]);
  };

  const addCon = () => {
    const currentCons = form.getValues("cons");
    form.setValue("cons", [...currentCons, ""]);
  };

  const removePro = (index: number) => {
    const currentPros = form.getValues("pros");
    form.setValue("pros", currentPros.filter((_, i) => i !== index));
  };

  const removeCon = (index: number) => {
    const currentCons = form.getValues("cons");
    form.setValue("cons", currentCons.filter((_, i) => i !== index));
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <FormLabel className="text-green-500">Pros</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPro}
            className="text-green-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pro
          </Button>
        </div>
        <div className="space-y-2">
          {form.watch("pros").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`pros.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input {...field} placeholder="Enter a pro..." />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePro(index)}
                        className="text-red-500"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <FormLabel className="text-red-500">Cons</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCon}
            className="text-red-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Con
          </Button>
        </div>
        <div className="space-y-2">
          {form.watch("cons").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`cons.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input {...field} placeholder="Enter a con..." />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCon(index)}
                        className="text-red-500"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProsCons;