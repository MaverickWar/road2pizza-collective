import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PizzaTypeCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
  displayOrder: number;
  isFirst: boolean;
  isLast: boolean;
  showControls: boolean;
  onReorder: (id: string, currentOrder: number, direction: 'up' | 'down') => void;
}

const PizzaTypeCard = ({
  id,
  name,
  description,
  imageUrl,
  slug,
  displayOrder,
  isFirst,
  isLast,
  showControls,
  onReorder
}: PizzaTypeCardProps) => {
  return (
    <div className="relative group">
      {showControls && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onReorder(id, displayOrder, 'up')}
            disabled={isFirst}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onReorder(id, displayOrder, 'down')}
            disabled={isLast}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}
      <Link
        to={`/pizza/${slug}`}
        className="block relative overflow-hidden rounded-lg aspect-square hover:transform hover:scale-105 transition-transform duration-300"
      >
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-textLight mb-2">{name}</h3>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      </Link>
    </div>
  );
};

export default PizzaTypeCard;