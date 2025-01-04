import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SortControlsProps {
  onReorder: (direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const SortControls = ({ onReorder, isFirst, isLast }: SortControlsProps) => {
  return (
    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-10">
      <Button
        variant="secondary"
        size="icon"
        className="w-8 h-8"
        onClick={() => onReorder('up')}
        disabled={isFirst}
      >
        <ChevronUp className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="w-8 h-8"
        onClick={() => onReorder('down')}
        disabled={isLast}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SortControls;