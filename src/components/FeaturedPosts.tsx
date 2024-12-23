import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clock, ChefHat, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedPosts = () => {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: async () => {
      console.log('Fetching featured recipes...');
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          id,
          title,
          author,
          image_url,
          prep_time,
          categories (
            id,
            name
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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes (previously cacheTime)
  });

  if (!isLoading && (!recipes || recipes.length === 0)) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FFB168] text-transparent bg-clip-text inline-block">
            Featured Recipes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Discover our community's most loved and highly rated pizza recipes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-card rounded-xl overflow-hidden shadow-lg">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          ) : (
            recipes?.map((recipe) => (
              <Link 
                to={`/article/${recipe.id}`}
                key={recipe.id}
                className="group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={recipe.image_url || '/placeholder.svg'} 
                    alt={recipe.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-2 text-sm text-accent font-semibold mb-2">
                    <ChefHat className="w-4 h-4" />
                    {recipe.categories?.name || 'Classic'}
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.prep_time || '30 mins'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#FFB168]" />
                      <span>4.9</span>
                    </div>
                  </div>
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