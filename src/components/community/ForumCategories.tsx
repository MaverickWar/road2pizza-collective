import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { MessageSquare, Pin, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  thread_count?: number;
  latest_thread?: {
    title: string;
    created_at: string;
  };
}

const ForumCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching forum categories...');
      const { data, error } = await supabase
        .from('forum_categories')
        .select(`
          id,
          name,
          description,
          forum_threads (
            id,
            title,
            created_at,
            is_pinned,
            is_locked
          )
        `)
        .order('display_order');

      if (error) throw error;

      const categoriesWithCounts = data.map(category => ({
        ...category,
        thread_count: category.forum_threads?.length || 0,
        latest_thread: category.forum_threads?.[0]
      }));

      console.log('Fetched categories:', categoriesWithCounts);
      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load forum categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-textLight">Forum Categories</h2>
        {isAdmin && (
          <Button asChild variant="outline">
            <Link to="/admin/forum">Manage Categories</Link>
          </Button>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-textLight bg-secondary rounded-lg">
          No categories available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/community/forum/${category.id}`}
              className="block p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-textLight">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-textLight/70 mt-1">{category.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-textLight/70">
                  <MessageSquare className="w-4 h-4" />
                  <span>{category.thread_count} threads</span>
                </div>
              </div>
              {category.latest_thread && (
                <div className="mt-2 text-sm text-textLight/70">
                  Latest: {category.latest_thread.title}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumCategories;