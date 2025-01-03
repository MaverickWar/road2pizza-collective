import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import EditRecipeModal from "./EditRecipeModal";
import { useState } from "react";
import type { Recipe } from "@/components/recipe/types";
import RecipeHeader from "./RecipeHeader";
import RecipeContent from "./RecipeContent";

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
            username
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
          recipe={recipe}
          canEdit={canEdit}
          onBack={() => navigate(-1)}
          onEdit={() => setShowEditModal(true)}
          onHide={handleHideRecipe}
        />

        <RecipeContent recipe={recipe} />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: recipe.content || '' }} />
            </div>

            {recipe.reviews && recipe.reviews.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                <div className="space-y-6">
                  {recipe.reviews.map((review, index) => (
                    <div key={index} className="bg-secondary rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <Avatar>
                          <AvatarFallback>{getInitials(review.profiles.username)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-2">
                          <p className="font-semibold">{review.profiles.username}</p>
                          <p className="text-sm text-gray-500">{format(new Date(review.created_at), 'MMMM dd, yyyy')}</p>
                        </div>
                      </div>
                      <Rating value={review.rating} />
                      <p className="mt-2">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Recipe Details */}
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
              <p><strong>Prep Time:</strong> {recipe.prep_time}</p>
              <p><strong>Cook Time:</strong> {recipe.cook_time}</p>
              <p><strong>Servings:</strong> {recipe.servings}</p>
              <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            </div>

            {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                <ul className="list-disc list-inside space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            )}

            {Array.isArray(recipe.tips) && recipe.tips.length > 0 && (
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
                <ul className="list-disc list-inside space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
  );
};

export default ArticleDetail;