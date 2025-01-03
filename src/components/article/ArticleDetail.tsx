import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { toast } from "sonner";
import type { Recipe } from "@/components/recipe/types";
import EditRecipeModal from "./EditRecipeModal";
import RecipeHeader from "./RecipeHeader";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import RecipeDetailLayout from "./detail/RecipeDetailLayout";

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

  // Simplified permission check - if you're admin or staff, or if you created the recipe
  const canEdit = Boolean(user && (isAdmin || isStaff || (recipe && user.id === recipe.created_by)));
  
  console.log('Permission check:', {
    userId: user?.id,
    recipeCreator: recipe?.created_by,
    isAdmin,
    isStaff,
    canEdit
  });

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

  return (
    <>
      <Navigation />
      <main className="pt-[120px] min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-pulse text-lg">Loading recipe...</div>
            </div>
          ) : error || !recipe ? (
            <Card className="p-6 max-w-lg mx-auto">
              <h2 className="text-xl font-semibold mb-2">Error loading recipe</h2>
              <p className="text-gray-500">{error?.message || 'Recipe not found'}</p>
            </Card>
          ) : (
            <>
              <RecipeHeader
                canEdit={canEdit}
                onBack={() => navigate(-1)}
                onEdit={() => setShowEditModal(true)}
                onHide={handleHideRecipe}
              />

              {recipe.status === 'unpublished' && (
                <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6">
                  This recipe is unpublished. Only you and administrators can view it.
                </div>
              )}

              <RecipeDetailLayout recipe={recipe} />

              {showEditModal && (
                <EditRecipeModal
                  recipe={recipe}
                  onClose={() => {
                    setShowEditModal(false);
                    refetch();
                  }}
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default ArticleDetail;