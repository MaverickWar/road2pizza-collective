import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import NotFound from "./NotFound";

const PizzaStyle = () => {
  const { style } = useParams();
  console.log('Loading pizza style:', style);

  const { data: pizzaType, isLoading, error } = useQuery({
    queryKey: ['pizzaType', style],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pizza_types')
        .select('*')
        .eq('slug', style)
        .single();

      if (error) {
        console.error('Error fetching pizza type:', error);
        throw error;
      }

      console.log('Fetched pizza type:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </>
    );
  }

  if (error || !pizzaType) {
    return <NotFound />;
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{pizzaType.name}</h1>
          {pizzaType.image_url && (
            <img
              src={pizzaType.image_url}
              alt={pizzaType.name}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}
          <div className="prose dark:prose-invert max-w-none">
            <p>{pizzaType.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PizzaStyle;