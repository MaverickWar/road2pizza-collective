import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FormActions = ({ onClose, onSubmit, isSubmitting }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 mt-4 sticky bottom-0 bg-card p-4 border-t">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        onClick={onSubmit} 
        disabled={isSubmitting}
        className="bg-accent hover:bg-accent-hover text-accent-foreground"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
};

export default FormActions;