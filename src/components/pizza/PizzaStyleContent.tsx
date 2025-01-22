import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PizzaStyleRecipes } from "./PizzaStyleRecipes";

const PizzaStyleContent = () => {
  const { slug } = useParams();

  const { data: pizzaType, isLoading } = useQuery({
    queryKey: ['pizza-type', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pizza_types')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: recipes = [], isLoading: recipesLoading } = useQuery({
    queryKey: ['pizza-recipes', pizzaType?.id],
    enabled: !!pizzaType?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('category_id', pizzaType.id);

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading || recipesLoading) {
    return <div>Loading...</div>;
  }

  if (!pizzaType) {
    return <div>Pizza style not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif mb-6">{pizzaType.name}</h1>
      <p className="text-muted-foreground mb-8">{pizzaType.description}</p>
      <PizzaStyleRecipes recipes={recipes} isLoading={recipesLoading} />
    </div>
  );
};

export default PizzaStyleContent;