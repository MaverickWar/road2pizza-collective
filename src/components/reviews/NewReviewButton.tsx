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
      className="flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      New Review
    </Button>
  );
};

export default NewReviewButton;