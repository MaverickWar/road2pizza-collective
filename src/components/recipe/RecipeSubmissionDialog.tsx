
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RecipeSubmissionForm from "./RecipeSubmissionForm";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            onSuccess={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSubmissionDialog;
