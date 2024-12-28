import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Editor from '@/components/Editor';

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
  onDelete?: () => void;
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
  onReorder,
  onDelete
}: PizzaTypeCardProps) => {
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedImageUrl, setEditedImageUrl] = useState(imageUrl);
  const longPressTimeout = React.useRef<NodeJS.Timeout>();

  const handleTouchStart = () => {
    if (!showControls) return;
    longPressTimeout.current = setTimeout(() => {
      setIsLongPressed(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  const handleMouseDown = () => {
    if (!showControls) return;
    longPressTimeout.current = setTimeout(() => {
      setIsLongPressed(true);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  const handleMouseLeave = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
    setIsLongPressed(false);
  };

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from('pizza_types')
        .update({
          name: editedName,
          description: editedDescription,
          image_url: editedImageUrl,
          slug: editedName.toLowerCase().replace(/\s+/g, '-'),
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Pizza style updated successfully');
      setIsEditDialogOpen(false);
      window.location.reload(); // Refresh to show changes
    } catch (error) {
      console.error('Error updating pizza type:', error);
      toast.error('Failed to update pizza style');
    }
  };

  const handleDelete = async () => {
    try {
      // First, update any recipes in this category to Uncategorized
      const { data: uncategorizedCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', 'Uncategorized')
        .single();

      if (uncategorizedCategory) {
        await supabase
          .from('recipes')
          .update({ category_id: uncategorizedCategory.id })
          .eq('category_id', id);
      }

      // Then delete the pizza type
      const { error } = await supabase
        .from('pizza_types')
        .update({ is_hidden: true })
        .eq('id', id);

      if (error) throw error;

      toast.success('Pizza style deleted successfully');
      setIsDeleteDialogOpen(false);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting pizza type:', error);
      toast.error('Failed to delete pizza style');
    }
  };

  return (
    <div 
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {showControls && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          {isLongPressed ? (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8"
                onClick={() => onReorder(id, displayOrder, 'up')}
                disabled={isFirst}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8"
                onClick={() => onReorder(id, displayOrder, 'down')}
                disabled={isLast}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="w-8 h-8"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="w-8 h-8"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      )}

      <Link
        to={`/pizza/${slug}`}
        className="block relative overflow-hidden rounded-lg aspect-square hover:transform hover:scale-105 transition-transform duration-300"
        onClick={(e) => {
          if (isLongPressed) {
            e.preventDefault();
          }
        }}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <p className="text-sm text-gray-200">{description}</p>
        </div>
      </Link>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pizza Style</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Editor 
                content={editedDescription} 
                onChange={setEditedDescription}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={editedImageUrl}
                onChange={(e) => setEditedImageUrl(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Pizza Style</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this pizza style? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PizzaTypeCard;