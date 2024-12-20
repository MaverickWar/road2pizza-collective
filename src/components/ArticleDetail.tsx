import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ArticleHeader from './article/ArticleHeader';
import RecipeDetails from './article/RecipeDetails';
import Ingredients from './article/Ingredients';
import Instructions from './article/Instructions';
import ProTips from './article/ProTips';
import NutritionInfo from './article/NutritionInfo';

const ArticleDetail = () => {
  const { id } = useParams();

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      console.log('Fetching article:', id);
      if (!id) throw new Error('Article ID is required');
      
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching article:', error);
        throw error;
      }
      
      console.log('Fetched article:', data);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="h-4 bg-secondary rounded w-1/4"></div>
            <div className="h-[300px] bg-secondary rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <Link to="/" className="text-accent hover:text-highlight">Return home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <article className="container mx-auto px-4 py-8">
        <ArticleHeader 
          category={recipe.category_id}
          title={recipe.title}
          author={recipe.author}
        />
        
        <div className="max-w-4xl mx-auto">
          <RecipeDetails recipeId={recipe.id} />

          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] mb-8 rounded-lg overflow-hidden">
            <img 
              src={recipe.image_url || '/placeholder.svg'} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          <Ingredients ingredients={recipe.ingredients || []} />
          <Instructions instructions={recipe.instructions || []} />

          <div className="prose prose-invert max-w-none">
            {recipe.content?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-lg leading-relaxed">{paragraph}</p>
            ))}
          </div>

          <ProTips tips={recipe.tips || []} />
          {recipe.nutrition_info && (
            <NutritionInfo nutritionInfo={recipe.nutrition_info} />
          )}
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;