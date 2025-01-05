import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export default function ReviewsDashboard() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['equipment-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Reviews Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews?.map((review) => (
            <Card key={review.id} className="p-4">
              <h3 className="font-semibold">{review.title}</h3>
              <p className="text-sm text-muted-foreground">{review.brand}</p>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}