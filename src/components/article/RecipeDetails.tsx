import React from 'react';
import { Clock, Users, ChefHat } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RecipeDetailsProps {
  recipeId: string;
}

const RecipeDetails = ({ recipeId }: RecipeDetailsProps) => {
  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: async () => {
      console.log('Fetching recipe details:', recipeId);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching recipe:', error);
        throw error;
      }
      console.log('Fetched recipe:', data);
      return data;
    },
    enabled: !!recipeId,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-secondary p-4 rounded-lg animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded"></div>
        ))}
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="mb-8 p-4 bg-destructive/10 text-destructive rounded-lg">
        Recipe details not found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-secondary p-4 rounded-lg">
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-accent" />
        <div>
          <p className="text-sm text-gray-400">Prep Time</p>
          <p className="font-medium">{recipe.prep_time}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="w-5 h-5 text-accent" />
        <div>
          <p className="text-sm text-gray-400">Cook Time</p>
          <p className="font-medium">{recipe.cook_time}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Users className="w-5 h-5 text-accent" />
        <div>
          <p className="text-sm text-gray-400">Servings</p>
          <p className="font-medium">{recipe.servings}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ChefHat className="w-5 h-5 text-accent" />
        <div>
          <p className="text-sm text-gray-400">Difficulty</p>
          <p className="font-medium">{recipe.difficulty}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;