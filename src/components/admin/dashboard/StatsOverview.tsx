import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Pizza, BookOpen, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const StatsOverview = () => {
  console.log("Rendering StatsOverview component");
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      console.log("Fetching admin statistics...");
      const [usersResponse, pizzaTypesResponse, recipesResponse] = await Promise.all([
        supabase.from("profiles").select("count"),
        supabase.from("pizza_types").select("count").eq("is_hidden", false),
        supabase.from("recipes").select("count"),
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (pizzaTypesResponse.error) throw pizzaTypesResponse.error;
      if (recipesResponse.error) throw recipesResponse.error;

      return {
        users: usersResponse.data[0]?.count || 0,
        pizzaTypes: pizzaTypesResponse.data[0]?.count || 0,
        recipes: recipesResponse.data[0]?.count || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Total Members",
      value: stats?.users || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Pizza Types",
      value: stats?.pizzaTypes || 0,
      icon: Pizza,
      color: "text-orange-500",
    },
    {
      title: "Total Recipes",
      value: stats?.recipes || 0,
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      title: "Active Today",
      value: "Coming soon",
      icon: Activity,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={cn("h-4 w-4", item.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;