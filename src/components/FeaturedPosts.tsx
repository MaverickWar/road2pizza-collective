import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const FeaturedPosts = () => {
  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: async () => {
      console.log('Fetching featured recipes...');
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          categories (
            id,
            name,
            description
          )
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) {
        console.error('Error fetching featured recipes:', error);
        throw error;
      }
      console.log('Fetched featured recipes:', data);
      return data || [];
    },
  });

  if (error) {
    console.error('Featured posts error:', error);
    return null;
  }

  if (!isLoading && (!recipes || recipes.length === 0)) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-textLight mb-8 md:mb-12">Featured Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div 
                key={index}
                className="bg-background rounded-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 md:h-56 bg-muted" />
                <div className="p-4 md:p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            recipes?.map((recipe) => (
              <Link 
                to={`/article/${recipe.id}`}
                key={recipe.id}
                className="bg-background rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img 
                    src={recipe.image_url || '/placeholder.svg'} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="p-4 md:p-6">
                  <span className="text-accent text-sm font-semibold">
                    {recipe.categories?.name || 'Uncategorized'}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-textLight mt-2 mb-3">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base">
                    By {recipe.author}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;