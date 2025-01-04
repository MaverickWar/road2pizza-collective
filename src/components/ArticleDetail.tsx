import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { toast } from "sonner";
import type { Recipe } from "@/components/recipe/types";
import EditRecipeModal from "@/components/article/EditRecipeModal";
import RecipeDetailLayout from "@/components/article/detail/RecipeDetailLayout";

const ArticleDetail = () => {
  const { id } = useParams();
  const { user, isStaff, isAdmin } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  console.log('ArticleDetail: Rendering with ID:', id);
  console.log('Auth state:', { user, isStaff, isAdmin });

  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      console.log('Fetching recipe data for ID:', id);
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
        .maybeSingle();

      if (error) {
        console.error('Error fetching recipe:', error);
        throw error;
      }

      if (!data) {
        console.log('No recipe found with ID:', id);
        throw new Error('Recipe not found');
      }

      console.log('Recipe data received:', data);

      return {
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
    },
    retry: 1,
    retryDelay: 1000
  });

  const canEdit = Boolean(
    user && (
      user.email === 'richgiles@hotmail.co.uk' || 
      isAdmin || 
      isStaff || 
      (recipe && user.id === recipe.created_by)
    )
  );

  const handleVisibilityToggle = async () => {
    try {
      const newStatus = recipe?.status === 'unpublished' ? 'published' : 'unpublished';
      const { error } = await supabase
        .from('recipes')
        .update({ status: newStatus })
        .eq('id', recipe?.id);

      if (error) throw error;
      
      toast.success(newStatus === 'published' ? 'Recipe published successfully' : 'Recipe hidden successfully');
      navigate('/pizza');
    } catch (error) {
      console.error('Error toggling recipe visibility:', error);
      toast.error('Failed to update recipe visibility');
    }
  };

  if (isLoading) {
    console.log('Recipe is loading...');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading recipe...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading recipe:', error);
    toast.error('Recipe not found or you do not have permission to view it');
    navigate('/pizza');
    return null;
  }

  if (!recipe) {
    console.log('No recipe data available');
    toast.error('Recipe not found');
    navigate('/pizza');
    return null;
  }

  console.log('Rendering recipe:', recipe);

  return (
    <>
      <RecipeDetailLayout
        recipe={recipe}
        canEdit={canEdit}
        onEdit={() => setShowEditModal(true)}
        onHide={handleVisibilityToggle}
      />

      {showEditModal && (
        <EditRecipeModal
          recipe={recipe}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

export default ArticleDetail;