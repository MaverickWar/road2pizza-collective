import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number | null;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching forum categories...');
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      console.log('Fetched categories:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        toast.error('Category name is required');
        return;
      }

      const { data, error } = await supabase
        .from('forum_categories')
        .insert({
          name: newCategory.name.trim(),
          description: newCategory.description.trim() || null,
          display_order: (categories.length + 1) * 10
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Category added successfully');
      setCategories([...categories, data]);
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleUpdateCategory = async (id: string) => {
    try {
      if (!editingCategory || !editingCategory.name.trim()) {
        toast.error('Category name is required');
        return;
      }

      const { error } = await supabase
        .from('forum_categories')
        .update({
          name: editingCategory.name.trim(),
          description: editingCategory.description?.trim() || null
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Category updated successfully');
      setCategories(categories.map(cat => 
        cat.id === id ? editingCategory : cat
      ));
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('forum_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Category deleted successfully');
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold">Add New Category</h3>
        <div className="space-y-4">
          <Input
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <Textarea
            placeholder="Category Description (optional)"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <Button onClick={handleAddCategory} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-card p-6 rounded-lg space-y-4">
            {editingCategory?.id === category.id ? (
              <div className="space-y-4">
                <Input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ 
                    ...editingCategory, 
                    name: e.target.value 
                  })}
                />
                <Textarea
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ 
                    ...editingCategory, 
                    description: e.target.value 
                  })}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleUpdateCategory(category.id)}
                    className="flex-1"
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingCategory(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;