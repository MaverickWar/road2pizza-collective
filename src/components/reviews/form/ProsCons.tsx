import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ReviewFormData } from "@/types/review";

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
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-green-500">Pros</Label>
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
          {(form.watch("pros") || [""]).map((pro, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={pro}
                onChange={(e) => updatePro(index, e.target.value)}
                placeholder="Enter a pro..."
              />
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
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-red-500">Cons</Label>
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
          {(form.watch("cons") || [""]).map((con, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={con}
                onChange={(e) => updateCon(index, e.target.value)}
                placeholder="Enter a con..."
              />
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProsCons;