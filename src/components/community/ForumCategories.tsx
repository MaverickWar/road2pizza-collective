import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CategorySection from './CategorySection';
import ForumBreadcrumbs from '../forum/ForumBreadcrumbs';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CategoryManager } from './CategoryManager';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '../ui/button';

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
    view_count: number;
    forum_posts: {
      id: string;
      content: string;
      created_at: string;
    }[];
  }[];
}

const ForumCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterPinned, setFilterPinned] = useState(false);

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
              view_count,
              forum_posts (
                id,
                content,
                created_at
              )
            `)
            .eq('category_id', category.id);

          if (threadsError) throw threadsError;

          return {
            ...category,
            forum_threads: threadsData || [],
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

  const filteredCategories = categories.map(category => ({
    ...category,
    forum_threads: category.forum_threads
      .filter(thread => 
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!filterPinned || thread.is_pinned)
      )
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      })
  }));

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-orange-100/50 dark:bg-[#221F26]/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-orange-100/50 dark:bg-[#221F26]/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-orange-100/50 dark:bg-[#221F26]/50 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ForumBreadcrumbs />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100">
          Forum Categories
        </h2>
        <CategoryManager onCategoryAdded={fetchCategories} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500 dark:text-orange-400" />
          <Input
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-orange-50 hover:bg-orange-100 dark:bg-[#221F26] dark:hover:bg-[#1A1F2C]">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterPinned(!filterPinned)}>
                {filterPinned ? '✓ ' : ''} Show Pinned Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-orange-50 hover:bg-orange-100 dark:bg-[#221F26] dark:hover:bg-[#1A1F2C]"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4 mr-2" />
            ) : (
              <SortDesc className="h-4 w-4 mr-2" />
            )}
            Sort
          </Button>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-8 text-gray-600 bg-orange-50 dark:bg-[#221F26] dark:text-gray-300 rounded-lg border border-orange-100 dark:border-[#1A1F2C]">
          No categories available yet.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCategories.map((category) => (
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