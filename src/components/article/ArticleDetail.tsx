import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { toast } from "sonner";
import type { Recipe } from "@/components/recipe/types";
import EditRecipeModal from "./EditRecipeModal";
import RecipeDetailLayout from "./detail/RecipeDetailLayout";

const ArticleDetail = () => {
  const { id } = useParams();
  const { user, isStaff, isAdmin } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  console.log('Auth state:', { 
    user, 
    isStaff, 
    isAdmin, 
    userEmail: user?.email,
    userId: user?.id 
  });

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

      console.log('Recipe data:', data);

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

  // Always allow edit access for admin accounts with email richgiles@hotmail.co.uk
  const canEdit = Boolean(
    user && (
      user.email === 'richgiles@hotmail.co.uk' || 
      isAdmin || 
      isStaff || 
      (recipe && user.id === recipe.created_by)
    )
  );
  
  console.log('Permission check:', {
    userEmail: user?.email,
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
      refetch();
    } catch (error) {
      console.error('Error hiding recipe:', error);
      toast.error('Failed to hide recipe');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading recipe...</div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-2">Error loading recipe</h2>
          <p className="text-gray-500">{error?.message || 'Recipe not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RecipeDetailLayout
        recipe={recipe}
        canEdit={canEdit}
        onEdit={() => setShowEditModal(true)}
        onHide={handleHideRecipe}
      />

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
  );
};

export default ArticleDetail;