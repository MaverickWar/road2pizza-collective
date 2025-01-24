import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CategorySection from "./CategorySection";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ForumCategories = () => {
  const { data: categories = [], isError, isLoading } = useQuery({
    queryKey: ["forum-categories"],
    queryFn: async () => {
      console.log("Fetching forum categories...");
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
            ),
            forum_posts (
              id,
              content,
              created_at,
              created_by,
              thread_id,
              is_solution,
              is_edited,
              likes_count,
              is_reported,
              is_removed,
              user:profiles!forum_posts_created_by_fkey (
                username,
                avatar_url,
                is_admin,
                is_staff
              )
            )
          )
        `)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching forum categories:', error);
        throw error;
      }
      
      console.log("Forum categories fetched successfully:", data);
      return data || [];
    },
    staleTime: 1000 * 60 * 2, // Data stays fresh for 2 minutes
    gcTime: 1000 * 60 * 5,    // Keep unused data in cache for 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false;
      return failureCount < 3;
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
    <div className="space-y-8">
      {categories.map((category) => (
        <CategorySection 
          key={category.id} 
          category={category} 
          onThreadCreated={() => {
            // The query client will handle this automatically
          }}
        />
      ))}
    </div>
  );
};

export default ForumCategories;