import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import CategorySection from './CategorySection';
import ForumBreadcrumbs from '../forum/ForumBreadcrumbs';

interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  forum_threads: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    is_pinned: boolean;
    is_locked: boolean;
    posts: {
      id: string;
      content: string;
      created_at: string;
    }[];
  }[];
}

const ForumCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  const fetchCategories = async () => {
    try {
      console.log('Fetching forum categories...');
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('forum_categories')
        .select('id, name, description')
        .order('display_order');

      if (categoriesError) throw categoriesError;

      const categoriesWithThreads = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { data: threadsData, error: threadsError } = await supabase
            .from('forum_threads')
            .select(`
              id,
              title,
              content,
              created_at,
              is_pinned,
              is_locked,
              likes_count
            `)
            .eq('category_id', category.id);

          if (threadsError) throw threadsError;

          const threadsWithPosts = await Promise.all(
            (threadsData || []).map(async (thread) => {
              const { data: postsData, error: postsError } = await supabase
                .from('forum_posts')
                .select('id, content, created_at')
                .eq('thread_id', thread.id);

              if (postsError) throw postsError;

              return {
                ...thread,
                posts: postsData || [],
              };
            })
          );

          return {
            ...category,
            forum_threads: threadsWithPosts,
          };
        })
      );

      console.log('Fetched categories:', categoriesWithThreads);
      setCategories(categoriesWithThreads);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load forum categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-purple-100/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-purple-100/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-purple-100/50 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ForumBreadcrumbs />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
          Forum Categories
        </h2>
        {isAdmin && (
          <Button asChild variant="outline">
            <Link to="/dashboard/admin/forum">Manage Categories</Link>
          </Button>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-600 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
          No categories available yet.
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <CategorySection 
              key={category.id} 
              category={category}
              onThreadCreated={fetchCategories}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumCategories;