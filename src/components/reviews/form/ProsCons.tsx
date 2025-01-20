import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, ThumbsUp, ThumbsDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import type { ReviewFormData } from "@/types/review";
import { Card } from "@/components/ui/card";

interface ProsConsProps {
  form: UseFormReturn<ReviewFormData>;
}

const ProsCons = ({ form }: ProsConsProps) => {
  const addPro = () => {
    const currentPros = form.getValues("pros") || [];
    form.setValue("pros", [...currentPros, ""]);
  };

  const addCon = () => {
    const currentCons = form.getValues("cons") || [];
    form.setValue("cons", [...currentCons, ""]);
  };

  const updatePro = (index: number, value: string) => {
    const currentPros = form.getValues("pros") || [];
    const newPros = [...currentPros];
    newPros[index] = value;
    form.setValue("pros", newPros);
  };

  const updateCon = (index: number, value: string) => {
    const currentCons = form.getValues("cons") || [];
    const newCons = [...currentCons];
    newCons[index] = value;
    form.setValue("cons", newCons);
  };

  const removePro = (index: number) => {
    const currentPros = form.getValues("pros") || [];
    form.setValue(
      "pros",
      currentPros.filter((_, i) => i !== index)
    );
  };

  const removeCon = (index: number) => {
    const currentCons = form.getValues("cons") || [];
    form.setValue(
      "cons",
      currentCons.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6 bg-background shadow-none border-green-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-green-600">
            <ThumbsUp className="w-5 h-5" />
            <Label className="text-base font-semibold">Pros</Label>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPro}
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pro
          </Button>
        </div>
        <div className="space-y-3">
          {(form.watch("pros") || [""]).map((pro, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={pro}
                onChange={(e) => updatePro(index, e.target.value)}
                placeholder="Enter a pro..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePro(index)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-background shadow-none border-red-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-red-600">
            <ThumbsDown className="w-5 h-5" />
            <Label className="text-base font-semibold">Cons</Label>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCon}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Con
          </Button>
        </div>
        <div className="space-y-3">
          {(form.watch("cons") || [""]).map((con, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={con}
                onChange={(e) => updateCon(index, e.target.value)}
                placeholder="Enter a con..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCon(index)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProsCons;