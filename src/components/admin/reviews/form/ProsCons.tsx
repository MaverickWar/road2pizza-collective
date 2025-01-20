import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import type { FormSectionProps } from "@/types/review";

const ProsCons = ({ formData, setFormData }: FormSectionProps) => {
  const addPro = () => {
    setFormData({
      pros: [...formData.pros, ""]
    });
  };

  const addCon = () => {
    setFormData({
      cons: [...formData.cons, ""]
    });
  };

  const updatePro = (index: number, value: string) => {
    const newPros = [...formData.pros];
    newPros[index] = value;
    setFormData({
      pros: newPros
    });
  };

  const updateCon = (index: number, value: string) => {
    const newCons = [...formData.cons];
    newCons[index] = value;
    setFormData({
      cons: newCons
    });
  };

  const removePro = (index: number) => {
    setFormData({
      pros: formData.pros.filter((_, i) => i !== index)
    });
  };

  const removeCon = (index: number) => {
    setFormData({
      cons: formData.cons.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="p-6 bg-background shadow-none">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-semibold text-green-600">Pros</Label>
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
          {formData.pros.map((pro, index) => (
            <div key={index} className="flex gap-2">
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

      <Card className="p-6 bg-background shadow-none">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-semibold text-red-600">Cons</Label>
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
          {formData.cons.map((con, index) => (
            <div key={index} className="flex gap-2">
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