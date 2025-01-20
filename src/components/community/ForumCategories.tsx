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
    category_id: string;
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
              category_id,
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
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-secondary/50 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-accent to-accent/30 p-6 rounded-lg shadow-lg">
        <ForumBreadcrumbs />
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
          Forum Categories
        </h2>
        <CategoryManager onCategoryAdded={fetchCategories} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center bg-card p-4 rounded-lg shadow-md border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
          <Input
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-accent/20 focus:border-accent"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-background/50 hover:bg-background border-accent/20 hover:border-accent">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card">
              <DropdownMenuItem onClick={() => setFilterPinned(!filterPinned)}>
                {filterPinned ? '✓ ' : ''} Show Pinned Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-background/50 hover:bg-background border-accent/20 hover:border-accent"
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
        <div className="text-center py-8 text-muted-foreground bg-card rounded-lg border border-border/50 shadow-md">
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