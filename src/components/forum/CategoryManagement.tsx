import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
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

  const handleCreate = async () => {
    try {
      if (!newCategory.name.trim()) {
        toast.error('Category name is required');
        return;
      }

      const { data, error } = await supabase
        .from('forum_categories')
        .insert([{
          name: newCategory.name,
          description: newCategory.description,
          display_order: categories.length
        }])
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data]);
      setNewCategory({ name: '', description: '' });
      setShowNewForm(false);
      toast.success('Category created successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('forum_categories')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, ...updates } : cat
      ));
      setEditingId(null);
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('forum_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Forum Categories</h2>
        <Button
          onClick={() => setShowNewForm(!showNewForm)}
          variant="outline"
        >
          {showNewForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          {showNewForm ? 'Cancel' : 'New Category'}
        </Button>
      </div>

      {showNewForm && (
        <Card className="p-4 space-y-4">
          <Input
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <Textarea
            placeholder="Description (optional)"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowNewForm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create Category
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id} className="p-4">
            {editingId === category.id ? (
              <div className="space-y-4">
                <Input
                  value={category.name}
                  onChange={(e) => handleUpdate(category.id, { name: e.target.value })}
                />
                <Textarea
                  value={category.description || ''}
                  onChange={(e) => handleUpdate(category.id, { description: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={() => handleUpdate(category.id, { name: category.name, description: category.description })}>
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingId(category.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;