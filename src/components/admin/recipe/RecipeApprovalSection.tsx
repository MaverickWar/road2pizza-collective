import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecipeApprovalTable from "./RecipeApprovalTable";

const RecipeApprovalSection = () => {
  const { data: pendingRecipes, isLoading } = useQuery({
    queryKey: ["pending-recipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(`
          *,
          profiles (username),
          categories (name)
        `)
        .eq("approval_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Approval Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <RecipeApprovalTable pendingRecipes={pendingRecipes || []} />
      </CardContent>
    </Card>
  );
};

export default RecipeApprovalSection;