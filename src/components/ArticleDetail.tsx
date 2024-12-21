import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Pencil, ArrowLeft } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Navigation from './Navigation';
import ArticleHeader from './article/ArticleHeader';
import RecipeDetails from './article/RecipeDetails';
import Ingredients from './article/Ingredients';
import Instructions from './article/Instructions';
import ProTips from './article/ProTips';
import NutritionInfo from './article/NutritionInfo';
import EditRecipeModal from './article/EditRecipeModal';

interface NutritionInfoType {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

const ArticleDetail = () => {
  const { id } = useParams();
  const { user, isAdmin, isStaff } = useAuth();
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Move canEdit to top level to avoid hooks ordering issues
  const canEdit = React.useMemo(() => {
    if (!user) return false;
    if (isAdmin || isStaff) return true;
    return recipe?.created_by === user.id;
  }, [user, isAdmin, isStaff, recipe?.created_by]);

  const { data: mockRecipe } = useQuery({
    queryKey: ['mock-article', id],
    queryFn: async () => {
      const { articles } = await import('@/data/articles');
      return articles[id as keyof typeof articles];
    },
    enabled: !!id,
  });

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
      
      if (!data) {
        console.log('No recipe found in Supabase, using mock data');
        return {
          id: crypto.randomUUID(),
          title: mockRecipe.title,
          author: mockRecipe.author,
          category_id: null,
          image_url: mockRecipe.image || '/placeholder.svg',
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

  const handleImageError = () => {
    console.log('Image failed to load, falling back to placeholder');
    setImageError(true);
  };

  // Helper function to convert category name to URL-friendly format
  const getCategorySlug = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Neapolitan': 'neapolitan',
      'New York Style': 'new-york',
      'Detroit Style': 'detroit',
      'Chicago Deep Dish': 'chicago',
      'Sicilian': 'sicilian',
      'Thin & Crispy': 'thin-crispy',
      'American': 'american',
      'Other Styles': 'other'
    };
    return categoryMap[category] || category.toLowerCase().replace(/ /g, '-');
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-20 px-4">
          <div className="container mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-secondary rounded w-1/3"></div>
              <div className="h-4 bg-secondary rounded w-1/4"></div>
              <div className="h-[300px] bg-secondary rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !recipe) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-20 px-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Article not found</h1>
            <Link to="/pizza" className="text-accent hover:text-highlight">Return to Pizza Styles</Link>
          </div>
        </div>
      </>
    );
  }

  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients.map(item => String(item))
    : [];
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.map(item => String(item))
    : [];
  const tips = Array.isArray(recipe.tips)
    ? recipe.tips.map(item => String(item))
    : [];
  const nutritionInfo = recipe.nutrition_info as NutritionInfoType;

  const categorySlug = getCategorySlug(mockRecipe?.category || '');

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20">
        <article className="container mx-auto px-4 py-8">
          <Link 
            to={`/pizza/${categorySlug}`}
            className="inline-flex items-center text-accent hover:text-highlight mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {mockRecipe?.category || 'Pizza Styles'}
          </Link>

          <div className="flex justify-between items-start mb-6">
            <ArticleHeader 
              category={recipe.category_id}
              title={recipe.title}
              author={recipe.author}
            />
            {canEdit && (
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Recipe
              </Button>
            )}
          </div>
          
          <div className="max-w-4xl mx-auto">
            <RecipeDetails recipeId={recipe.id} />

            <div className="rounded-lg overflow-hidden shadow-lg mb-8 bg-secondary">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <img 
                  src={!imageError ? recipe.image_url || '/placeholder.svg' : '/placeholder.svg'}
                  alt={recipe.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </AspectRatio>
            </div>

            <div className="space-y-8 md:space-y-12">
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
          </div>
        </article>

        {showEditModal && (
          <EditRecipeModal
            recipe={recipe}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default ArticleDetail;