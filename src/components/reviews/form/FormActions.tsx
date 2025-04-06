
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";

interface FormActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FormActions = ({ onClose, onSubmit, isSubmitting }: FormActionsProps) => {
  return (
    <div className="sticky bottom-0 z-10 p-4 border-t bg-background/95 backdrop-blur-sm shadow-md">
      <div className="flex justify-end gap-4 max-w-4xl mx-auto">
        <Button 
          type="button"
          variant="outline" 
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting}
          className="bg-admin hover:bg-admin-hover-DEFAULT text-white flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
