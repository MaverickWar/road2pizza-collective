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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading recipe: {error.message}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <RecipeHeader
          canEdit={canEdit}
          onBack={() => navigate(-1)}
          onEdit={() => setShowEditModal(true)}
          onHide={handleHideRecipe}
        />

        <RecipeContent recipe={recipe} />

        <ReviewSection reviews={recipe.reviews} />

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