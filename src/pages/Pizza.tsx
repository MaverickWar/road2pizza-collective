import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { PizzaTypeGrid } from "@/components/pizza/PizzaTypeGrid";

const Pizza = () => {
  const { data: pizzaTypes, isLoading } = useQuery({
    queryKey: ['pizzaTypes'],
    queryFn: async () => {
      console.log('Fetching pizza types');
      const { data, error } = await supabase
        .from('pizza_types')
        .select('*')
        .order('display_order', { ascending: true })
        .eq('is_hidden', false);

      if (error) {
        console.error('Error fetching pizza types:', error);
        throw error;
      }

      console.log('Fetched pizza types:', data);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8">Pizza Styles</h1>
        <PizzaTypeGrid pizzaTypes={pizzaTypes || []} />
      </div>
    </>
  );
};

export default Pizza;