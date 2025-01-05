import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

interface NewReviewButtonProps {
  onClick: () => void;
}

const NewReviewButton = ({ onClick }: NewReviewButtonProps) => {
  const { isAdmin, isStaff } = useAuth();

  if (!isAdmin && !isStaff) return null;

  return (
    <Button 
      onClick={onClick}
      className="bg-accent hover:bg-accent-hover text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2 transition-colors duration-200"
    >
      <Plus className="w-5 h-5" />
      New Review
    </Button>
  );
};

export default NewReviewButton;