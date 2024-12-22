import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import ArticleLoading from './article/ArticleLoading';
import ArticleError from './article/ArticleError';

interface NutritionInfoType {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

const isValidUUID = (str: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const ArticleDetail = () => {
  const { id } = useParams();
  const { user, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      console.log('Fetching recipe by id:', id);
      
      if (!id || !isValidUUID(id)) {
        console.error('Invalid recipe ID format:', id);
        throw new Error('Invalid recipe ID format');
      }

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
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching recipe:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No recipe found');
        throw new Error('Recipe not found');
      }
      
      console.log('Fetched recipe with category:', data);
      return data;
    },
    enabled: !!id,
  });

  const canEdit = React.useMemo(() => {
    if (!user || !recipe) return false;
    if (isAdmin || isStaff) return true;
    return recipe.created_by === user.id;
  }, [user, isAdmin, isStaff, recipe]);

  const handleImageError = () => {
    console.log('Image failed to load, falling back to placeholder');
    setImageError(true);
  };

  if (!id || !isValidUUID(id)) {
    return <ArticleError message="Invalid recipe ID format" />;
  }

  if (isLoading) return <ArticleLoading />;
  if (error || !recipe) return <ArticleError />;

  const ingredients = Array.isArray(recipe.ingredients) 
    ? recipe.ingredients.map(item => String(item))
    : [];
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.map(item => String(item))
    : [];
  const tips = Array.isArray(recipe.tips)
    ? recipe.tips.map(item => String(item))
    : [];
    
  const isValidNutritionInfo = (info: any): info is NutritionInfoType => {
    return (
      info &&
      typeof info === 'object' &&
      typeof info.calories === 'string' &&
      typeof info.protein === 'string' &&
      typeof info.carbs === 'string' &&
      typeof info.fat === 'string'
    );
  };

  const nutritionInfo = isValidNutritionInfo(recipe.nutrition_info) 
    ? recipe.nutrition_info 
    : null;

  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20">
        <article className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-start mb-6">
            <ArticleHeader 
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
