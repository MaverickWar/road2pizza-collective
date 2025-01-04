import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export const CategoryManager = ({ onCategoryAdded }: { onCategoryAdded: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const { isAdmin } = useAuth();

  const handleCreateCategory = async () => {
    try {
      const { error } = await supabase
        .from('forum_categories')
        .insert([{
          name: newCategory.name,
          description: newCategory.description,
        }]);

      if (error) throw error;

      toast.success('Category created successfully');
      setIsOpen(false);
      setNewCategory({ name: '', description: '' });
      onCategoryAdded();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  if (!isAdmin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <Button onClick={handleCreateCategory}>Create Category</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};