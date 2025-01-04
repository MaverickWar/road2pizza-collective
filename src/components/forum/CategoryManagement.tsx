import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryForm } from './components/CategoryForm';
import { CategoryItem } from './components/CategoryItem';
import { Category, CategoryFormData } from './types/category';

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      console.log('Fetched categories:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: CategoryFormData) => {
    try {
      if (!formData.name.trim()) {
        toast.error('Category name is required');
        return;
      }

      const { data, error } = await supabase
        .from('forum_categories')
        .insert([{
          name: formData.name,
          description: formData.description,
          display_order: categories.length
        }])
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data]);
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
      <CategoryForm onSubmit={handleCreate} />
      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;