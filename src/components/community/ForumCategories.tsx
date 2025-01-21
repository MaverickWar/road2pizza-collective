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
        .select('*')
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
      errorMessage: "Failed to load forum categories. Please try refreshing the page."
    }
  });

  if (isError) {
    toast.error("Failed to load forum categories");
  }

  return (
    <div className="bg-[#FEC6A1] p-4 rounded-lg">
      <div className="bg-secondary rounded-lg p-6">
        <h2 className="text-2xl font-bold text-textLight mb-6">Forum Categories</h2>
        <div className="space-y-6">
          {categories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumCategories;