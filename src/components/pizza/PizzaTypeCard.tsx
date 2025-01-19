import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Editor from '@/components/Editor';
import SortControls from './controls/SortControls';
import EditControls from './controls/EditControls';

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedImageUrl, setEditedImageUrl] = useState(imageUrl);

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
      window.location.reload();
    } catch (error) {
      console.error('Error updating pizza type:', error);
      toast.error('Failed to update pizza style');
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('pizza_types')
        .update({ 
          is_hidden: true,
          name: name,
          slug: slug
        })
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
    <div className="relative">
      {showControls && (
        <>
          <SortControls
            onReorder={(direction) => onReorder(id, displayOrder, direction)}
            isFirst={isFirst}
            isLast={isLast}
          />
          <EditControls
            onEdit={() => setIsEditDialogOpen(true)}
            onDelete={() => setIsDeleteDialogOpen(true)}
          />
        </>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <p className="text-sm text-gray-200">{description}</p>
        </div>
      </Link>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Edit Pizza Style</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full"
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
              <Input
                type="url"
                value={editedImageUrl}
                onChange={(e) => setEditedImageUrl(e.target.value)}
                className="w-full"
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
        <DialogContent className="bg-white">
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