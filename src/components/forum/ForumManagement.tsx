import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const ForumManagement = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      console.log('Fetching forum categories...');
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load forum categories');
        throw error;
      }

      console.log('Fetched categories:', data);
      return data;
    }
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Forum Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your forum categories and settings
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Category
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Card className="p-6 animate-pulse bg-muted" />
            <Card className="p-6 animate-pulse bg-muted" />
            <Card className="p-6 animate-pulse bg-muted" />
          </div>
        ) : (
          <div className="grid gap-6">
            {categories?.map((category) => (
              <Card key={category.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    {category.description && (
                      <p className="text-muted-foreground mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ForumManagement;