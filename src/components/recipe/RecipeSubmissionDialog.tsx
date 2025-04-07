
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import RecipeSubmissionForm from "./RecipeSubmissionForm";
import { useState } from "react";

interface RecipeSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pizzaTypeId?: string;
  pizzaTypeName?: string;
}

const RecipeSubmissionDialog = ({ 
  isOpen, 
  onClose, 
  pizzaTypeId,
  pizzaTypeName
}: RecipeSubmissionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    // Set a short delay to ensure the success message is seen
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Only allow closing if not submitting
      if (!isSubmitting && !open) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-6 shadow-lg border border-border rounded-lg">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Submit Your {pizzaTypeName ? `${pizzaTypeName} ` : ''}Recipe
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share your delicious pizza recipe with the community
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <RecipeSubmissionForm 
            pizzaTypeId={pizzaTypeId} 
            onSuccess={handleSuccess}
          />
        </div>

        {!isSubmitting && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSubmissionDialog;
