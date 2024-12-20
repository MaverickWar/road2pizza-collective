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

interface NutritionInfoType {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

const ArticleDetail = () => {
  const { id } = useParams();

  // First query to get the recipe from the mock data
  const { data: mockRecipe } = useQuery({
    queryKey: ['mock-article', id],
    queryFn: async () => {
      // Import dynamically to avoid bundling all articles
      const { articles } = await import('@/data/articles');
      return articles[id as keyof typeof articles];
    },
    enabled: !!id,
  });

  // Then use that to query Supabase with the title
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['article', mockRecipe?.title],
    queryFn: async () => {
      if (!mockRecipe?.title) throw new Error('Recipe title is required');
      
      console.log('Fetching recipe by title:', mockRecipe.title);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('title', mockRecipe.title)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching recipe:', error);
        throw error;
      }
      
      // If no data in Supabase yet, transform mock data to match Supabase schema
      if (!data) {
        console.log('No recipe found in Supabase, using mock data');
        return {
          id: crypto.randomUUID(), // Generate a valid UUID instead of mock-id
          title: mockRecipe.title,
          author: mockRecipe.author,
          category_id: null, // We'll set this to null since we don't have a category mapping yet
          image_url: mockRecipe.image || '/placeholder.svg', // Use the image property from mock data
          content: mockRecipe.content,
          ingredients: mockRecipe.ingredients || [],
          instructions: mockRecipe.instructions || [],
          tips: mockRecipe.tips || [],
          nutrition_info: mockRecipe.nutritionInfo || null,
          created_at: new Date().toISOString(),
          created_by: null,
          prep_time: mockRecipe.prepTime,
          cook_time: mockRecipe.cookTime,
          servings: mockRecipe.servings,
          difficulty: mockRecipe.difficulty,
        };
      }
      
      console.log('Fetched recipe:', data);
      return data;
    },
    enabled: !!mockRecipe?.title,
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

  // Ensure arrays are properly typed and handle potential null values
  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients.map(item => String(item))
    : [];
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.map(item => String(item))
    : [];
  const tips = Array.isArray(recipe.tips)
    ? recipe.tips.map(item => String(item))
    : [];

  // Ensure nutrition info is properly typed
  const nutritionInfo = recipe.nutrition_info as NutritionInfoType;

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

          <Ingredients ingredients={ingredients} />
          <Instructions instructions={instructions} />

          <div className="prose prose-invert max-w-none">
            {recipe.content?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-lg leading-relaxed">{paragraph}</p>
            ))}
          </div>

          <ProTips tips={tips} />
          {nutritionInfo && (
            <NutritionInfo nutritionInfo={nutritionInfo} />
          )}
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;