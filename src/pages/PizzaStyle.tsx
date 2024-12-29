import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/components/AuthProvider";
import RecipeSubmissionForm from "@/components/recipe/RecipeSubmissionForm";
import Navigation from "@/components/Navigation";

const PizzaStyle = () => {
  const { style } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: pizzaType, isLoading, error } = useQuery({
    queryKey: ["pizza-type", style],
    queryFn: async () => {
      console.log("Fetching pizza type:", style);
      if (!style) {
        throw new Error("No style parameter provided");
      }

      const { data, error } = await supabase
        .from("pizza_types")
        .select("*")
        .eq("slug", style)
        .eq("is_hidden", false)
        .single();
      
      if (error) {
        console.error("Error fetching pizza type:", error);
        throw error;
      }

      console.log("Found pizza type:", data);
      return data;
    },
    retry: false,
    enabled: !!style,
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
      
      if (error) {
        console.error("Error fetching recipes:", error);
        throw error;
      }

      console.log("Found recipes:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pizzaType) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Pizza Style Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The pizza style you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/pizza")}>
              Back to Pizza Styles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-20">
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
            {!recipes?.length ? (
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
    </div>
  );
};

export default PizzaStyle;