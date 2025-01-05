import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import type { ReviewFormData } from "../ReviewForm";

interface ProsConsProps {
  formData: ReviewFormData;
  setFormData: (data: ReviewFormData) => void;
}

const ProsCons = ({ formData, setFormData }: ProsConsProps) => {
  const addPro = () => {
    setFormData({
      ...formData,
      pros: [...formData.pros, ""]
    });
  };

  const addCon = () => {
    setFormData({
      ...formData,
      cons: [...formData.cons, ""]
    });
  };

  const updatePro = (index: number, value: string) => {
    const newPros = [...formData.pros];
    newPros[index] = value;
    setFormData({
      ...formData,
      pros: newPros
    });
  };

  const updateCon = (index: number, value: string) => {
    const newCons = [...formData.cons];
    newCons[index] = value;
    setFormData({
      ...formData,
      cons: newCons
    });
  };

  const removePro = (index: number) => {
    setFormData({
      ...formData,
      pros: formData.pros.filter((_, i) => i !== index)
    });
  };

  const removeCon = (index: number) => {
    setFormData({
      ...formData,
      cons: formData.cons.filter((_, i) => i !== index)
    });
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
          {formData.pros.map((pro, index) => (
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
          {formData.cons.map((con, index) => (
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