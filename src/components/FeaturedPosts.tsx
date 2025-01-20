import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clock, ChefHat, Star, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const FeaturedPosts = () => {
  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: async () => {
      console.log('Fetching featured recipes...');
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select(`
            id,
            title,
            author,
            image_url,
            prep_time,
            servings,
            categories (
              id,
              name
            )
          `)
          .eq('is_featured', true)
          .eq('status', 'published')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error('Error fetching featured recipes:', error);
          throw error;
        }
        
        console.log('Fetched featured recipes:', data);
        return data || [];
      } catch (error: any) {
        console.error('Failed to fetch featured recipes:', error);
        // Only show toast error once
        toast.error("Failed to load featured recipes. Please try again later.");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data for 10 minutes
    retry: 1, // Only retry once to avoid too many error toasts
  });

  // Don't render anything if there's an error or no recipes
  if (error || (!isLoading && (!recipes || recipes.length === 0))) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-background to-secondary/5">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-highlight bg-clip-text text-transparent inline-block">
            Featured Recipes
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our community's most loved and highly rated pizza recipes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-card rounded-xl overflow-hidden shadow-lg">
                <Skeleton className="h-56 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          ) : (
            recipes?.map((recipe, index) => (
              <Link 
                to={`/article/${recipe.id}`}
                key={recipe.id}
                className={cn(
                  "group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl",
                  "transition-all duration-300 transform hover:-translate-y-1",
                  "animate-fade-in flex flex-col h-full"
                )}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-56 overflow-hidden bg-secondary">
                  <img 
                    src={recipe.image_url || '/placeholder.svg'} 
                    alt={recipe.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 text-sm text-accent mb-3">
                    <ChefHat className="w-4 h-4" />
                    <span className="font-medium">{recipe.categories?.name || 'Classic'}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors line-clamp-2">
                    {recipe.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{recipe.prep_time || '30 mins'}</span>
                      </div>
                      {recipe.servings && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{recipe.servings}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-highlight" />
                      <span className="font-medium">4.9</span>
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