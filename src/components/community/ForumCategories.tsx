import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CategorySection from "./CategorySection";
import { toast } from "sonner";

const ForumCategories = () => {
  const { data: categories = [], isError } = useQuery({
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
          forum_threads (
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
            author:profiles(
              username,
              avatar_url
            ),
            last_poster:profiles(
              username,
              avatar_url
            ),
            forum_posts (*)
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
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    meta: {
      errorMessage: "Failed to load forum categories"
    }
  });

  if (isError) {
    toast.error("Failed to load forum categories");
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <CategorySection 
          key={category.id} 
          category={category} 
          onThreadCreated={() => {
            // Refetch the categories when a thread is created
            // The query client will handle this automatically
          }}
        />
      ))}
    </div>
  );
};

export default ForumCategories;