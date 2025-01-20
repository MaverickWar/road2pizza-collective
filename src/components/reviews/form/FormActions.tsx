import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";

interface FormActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FormActions = ({ onClose, onSubmit, isSubmitting }: FormActionsProps) => {
  return (
    <>
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
    </>
  );
};

export default FormActions;