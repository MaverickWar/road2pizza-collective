import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { toast } from "sonner";
import type { Recipe } from "@/components/recipe/types";
import EditRecipeModal from "./EditRecipeModal";
import RecipeHeader from "./RecipeHeader";
import RecipeContent from "./RecipeContent";
import ReviewSection from "./ReviewSection";
import AuthorCard from "./AuthorCard";
import MediaGallery from "./MediaGallery";
import { Card } from "@/components/ui/card";

const ArticleDetail = () => {
  const { id } = useParams();
  const { user, isStaff, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: recipe, isLoading, error, refetch } = useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      console.log('Fetching recipe:', id);
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          categories (
            name
          ),
          profiles (
            username,
            points,
            badge_title,
            badge_color,
            recipes_shared,
            created_at
          ),
          reviews (
            rating,
            content,
            user_id,
            created_at,
            profiles (
              username
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const recipeData = {
        ...data,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        instructions: Array.isArray(data.instructions) ? data.instructions : [],
        tips: Array.isArray(data.tips) ? data.tips : [],
        nutrition_info: data.nutrition_info && typeof data.nutrition_info === 'object' && !Array.isArray(data.nutrition_info) ? {
          calories: String((data.nutrition_info as Record<string, unknown>).calories || ''),
          protein: String((data.nutrition_info as Record<string, unknown>).protein || ''),
          carbs: String((data.nutrition_info as Record<string, unknown>).carbs || ''),
          fat: String((data.nutrition_info as Record<string, unknown>).fat || '')
        } : null,
        approval_status: data.approval_status as Recipe['approval_status']
      } as Recipe;

      if (recipeData.status === 'unpublished') {
        if (!user) {
          throw new Error('Recipe not found');
        }
        if (!isAdmin && !isStaff && user.id !== recipeData.created_by) {
          throw new Error('Recipe not found');
        }
      }

      return recipeData;
    }
  });

  const canEdit = user && (isAdmin || isStaff || user.id === recipe?.created_by);

  const handleHideRecipe = async () => {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ status: 'unpublished' })
        .eq('id', recipe?.id);

      if (error) throw error;

      toast.success('Recipe hidden successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error hiding recipe:', error);
      toast.error('Failed to hide recipe');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading recipe...</div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-2">Error loading recipe</h2>
          <p className="text-gray-500">{error?.message || 'Recipe not found'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <RecipeHeader
          canEdit={canEdit}
          onBack={() => navigate(-1)}
          onEdit={() => setShowEditModal(true)}
          onHide={handleHideRecipe}
        />

        {recipe?.status === 'unpublished' && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6">
            This recipe is unpublished. Only you and administrators can view it.
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <MediaGallery 
              imageUrl={recipe.image_url}
              videoUrl={recipe.video_url}
              videoProvider={recipe.video_provider}
              images={Array.isArray(recipe.images) ? recipe.images : []}
            />
            
            <RecipeContent recipe={recipe} />
            
            <ReviewSection reviews={recipe.reviews} />
          </div>

          <div className="space-y-6">
            <AuthorCard author={recipe.profiles} />
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
              <div className="space-y-2">
                <p><strong>Prep Time:</strong> {recipe.prep_time}</p>
                <p><strong>Cook Time:</strong> {recipe.cook_time}</p>
                <p><strong>Servings:</strong> {recipe.servings}</p>
                <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
              </div>
            </Card>

            {recipe.ingredients.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                <ul className="list-disc list-inside space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-200">{ingredient}</li>
                  ))}
                </ul>
              </Card>
            )}

            {recipe.instructions.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-200">{instruction}</li>
                  ))}
                </ol>
              </Card>
            )}

            {recipe.tips.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
                <ul className="list-disc list-inside space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <li key={index} className="text-gray-200">{tip}</li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>

        {showEditModal && recipe && (
          <EditRecipeModal
            recipe={recipe}
            onClose={() => {
              setShowEditModal(false);
              refetch();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;