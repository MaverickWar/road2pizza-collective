import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface EditControlsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const EditControls = ({ onEdit, onDelete }: EditControlsProps) => {
  return (
    <div className="absolute top-2 right-2 z-10 flex gap-1">
      <Button
        variant="secondary"
        size="icon"
        className="w-8 h-8"
        onClick={onEdit}
      >
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        className="w-8 h-8"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default EditControls;