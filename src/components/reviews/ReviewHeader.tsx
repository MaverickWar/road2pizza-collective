import { Button } from "@/components/ui/button";
import { Edit2, Save } from "lucide-react";

interface ReviewHeaderProps {
  isEditMode: boolean;
  onEditModeChange: (mode: boolean) => void;
}

const ReviewHeader = ({ isEditMode, onEditModeChange }: ReviewHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b py-3 mb-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold tracking-tight">Pizza Oven Reviews</h1>
        <Button
          variant={isEditMode ? "destructive" : "outline"}
          size="sm"
          onClick={() => onEditModeChange(!isEditMode)}
          className="flex items-center gap-2"
        >
          {isEditMode ? (
            <>
              <Save className="w-4 h-4" />
              Save Layout
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit Layout
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewHeader;