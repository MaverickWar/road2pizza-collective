import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ReviewHeaderProps {
  isEditMode: boolean;
  onEditModeChange: (mode: boolean) => void;
}

const ReviewHeader = ({ isEditMode, onEditModeChange }: ReviewHeaderProps) => {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reviews</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={isEditMode}
              onCheckedChange={onEditModeChange}
            />
            <span>Edit Mode</span>
          </div>
          <Button>New Review</Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewHeader;