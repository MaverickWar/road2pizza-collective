import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Rating } from "@/components/Rating";
import ArticleImage from "./ArticleImage";
import EditRecipeModal from "./EditRecipeModal";
import { useState } from "react";
import { toast } from "sonner";
import type { Recipe } from "@/components/recipe/types";

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
        <div className="flex items-center justify-between mb-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          
          {canEdit && (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowEditModal(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline"
                onClick={handleHideRecipe}
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </Button>
            </div>
          )}
        </div>

        {recipe?.status === 'unpublished' && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
            This recipe is unpublished. You may not have access to view it.
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{recipe?.title}</h1>
        
        {recipe?.image_url && (
          <ArticleImage imageUrl={recipe.image_url} title={recipe.title} />
        )}

        <div className="flex items-center mb-4">
          <Avatar>
            <AvatarFallback>{getInitials(recipe?.profiles?.username || '')}</AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <p className="text-sm text-gray-500">By {recipe?.profiles?.username}</p>
            <p className="text-sm text-gray-500">{format(new Date(recipe?.created_at || ''), 'MMMM dd, yyyy')}</p>
          </div>
        </div>

        {recipe?.reviews && <Rating value={recipe.reviews.reduce((acc, review) => acc + review.rating, 0) / recipe.reviews.length} />}

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