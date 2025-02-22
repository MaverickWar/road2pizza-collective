
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CategorySection from "./CategorySection";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ForumCategories = () => {
  const { data: categories = [], isError, isLoading } = useQuery({
    queryKey: ["forum-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select(`
          id,
          name,
          description,
          display_order,
          created_at,
          created_by,
          forum_threads!forum_threads_category_id_fkey (
            id,
            title,
            content,
            is_pinned,
            is_locked,
            category_id,
            created_at,
            view_count,
            created_by,
            post_count,
            last_post_at,
            last_post_by,
            password_protected,
            password,
            required_role,
            author:profiles!forum_threads_created_by_fkey (
              username,
              avatar_url,
              created_at,
              points,
              badge_title,
              badge_color,
              is_admin,
              is_staff
            ),
            last_poster:profiles!forum_threads_last_post_by_fkey (
              username,
              avatar_url
            )
          )
        `)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      // Group categories by type
      const grouped = data?.reduce((acc, category) => {
        const type = getGroupType(category.name);
        if (!acc[type]) acc[type] = [];
        acc[type].push(category);
        return acc;
      }, {} as Record<string, typeof data>);

      return grouped || {};
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border p-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <div className="space-y-4 mt-6">
              {[1, 2].map((j) => (
                <Skeleton key={j} className="h-20 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load forum categories");
    return (
      <div className="text-center p-8 text-muted-foreground">
        Unable to load categories. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Select defaultValue="latest">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest Activity</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Threads</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Activity</span>
          </div>
        </div>
      </div>

      {Object.entries(categories).map(([group, categoryList]) => (
        <div key={group} className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">{formatGroupName(group)}</h2>
          <div className="space-y-4">
            {categoryList.map((category) => (
              <CategorySection 
                key={category.id} 
                category={category}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper functions to group categories
const getGroupType = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('welcome') || lowerName.includes('introduction')) return 'getting-started';
  if (lowerName.includes('recipe') || lowerName.includes('cooking')) return 'recipes';
  if (lowerName.includes('equipment') || lowerName.includes('technique')) return 'equipment';
  if (lowerName.includes('general') || lowerName.includes('discussion')) return 'general';
  return 'other';
};

const formatGroupName = (group: string): string => {
  const names: Record<string, string> = {
    'getting-started': 'Getting Started',
    'recipes': 'Recipes & Cooking',
    'equipment': 'Equipment & Techniques',
    'general': 'General Discussion',
    'other': 'Other Topics'
  };
  return names[group] || group;
};

export default ForumCategories;
