import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/components/AuthProvider";
import RecipeSubmissionForm from "@/components/recipe/RecipeSubmissionForm";

const PizzaStyle = () => {
  const { slug } = useParams();
  const { user } = useAuth();

  const { data: pizzaType, isLoading } = useQuery({
    queryKey: ["pizza-type", slug],
    queryFn: async () => {
      console.log("Fetching pizza type:", slug);
      const { data, error } = await supabase
        .from("pizza_types")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: recipes } = useQuery({
    queryKey: ["pizza-recipes", pizzaType?.id],
    enabled: !!pizzaType?.id,
    queryFn: async () => {
      console.log("Fetching recipes for pizza type:", pizzaType?.id);
      const { data, error } = await supabase
        .from("recipes")
        .select(`
          *,
          profiles (username)
        `)
        .eq("category_id", pizzaType.id)
        .eq("status", "published")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!pizzaType) {
    return <div>Pizza style not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{pizzaType.name}</h1>
          {user && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Submit Recipe</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Submit a {pizzaType.name} Recipe</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto pr-4">
                  <RecipeSubmissionForm pizzaTypeId={pizzaType.id} />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p>{pizzaType.description}</p>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Community Recipes</h2>
          {recipes?.length === 0 ? (
            <p className="text-muted-foreground">
              No recipes yet. Be the first to submit one!
            </p>
          ) : (
            <div className="grid gap-6">
              {recipes?.map((recipe) => (
                <div
                  key={recipe.id}
                  className="border rounded-lg p-6 hover:border-accent transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    By {recipe.profiles.username}
                  </p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Prep: {recipe.prep_time}</span>
                    <span>Cook: {recipe.cook_time}</span>
                    <span>Difficulty: {recipe.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PizzaStyle;