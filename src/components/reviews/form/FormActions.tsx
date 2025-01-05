import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FormActions = ({ onClose, onSubmit, isSubmitting }: FormActionsProps) => {
  return (
    <>
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
    </>
  );
};

export default FormActions;