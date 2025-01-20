import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FormActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FormActions = ({ onClose, onSubmit, isSubmitting }: FormActionsProps) => {
  return (
    <Card className="sticky bottom-0 p-4 border-t rounded-none bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-end gap-4 max-w-[2000px] mx-auto">
        <Button
          variant="outline"
          onClick={onClose}
          type="button"
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </Card>
  );
};

export default FormActions;