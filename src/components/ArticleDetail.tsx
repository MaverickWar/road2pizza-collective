import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Rating } from "@/components/Rating";

const ArticleDetail = () => {
  const { id } = useParams();
  const { user, isStaff, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { data: recipe, isLoading, error } = useQuery({
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

      // Check if user has access to unpublished recipe
      if (data.status === 'unpublished') {
        if (!user) {
          throw new Error('Recipe not found');
        }
        if (!isAdmin && !isStaff && user.id !== data.created_by) {
          throw new Error('Recipe not found');
        }
      }

      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/4" />
          <div className="h-4 bg-secondary rounded w-1/2" />
          <div className="h-64 bg-secondary rounded" />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate(-1)} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {recipe.status === 'unpublished' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <p className="text-yellow-500">
              This recipe is currently unpublished and is only visible to you and our staff.
            </p>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
        
        <div className="flex items-center gap-4 text-muted-foreground mb-8">
          <span>By {recipe.author}</span>
          <span>•</span>
          <span>{format(new Date(recipe.created_at), 'MMMM d, yyyy')}</span>
          {recipe.categories?.name && (
            <>
              <span>•</span>
              <span>{recipe.categories.name}</span>
            </>
          )}
        </div>

        {recipe.image_url && (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: recipe.content }} />
            </div>

            {recipe.reviews && recipe.reviews.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                <div className="space-y-6">
                  {recipe.reviews.map((review, index) => (
                    <div key={index} className="bg-secondary rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(review.profiles.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{review.profiles.username}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(review.created_at), 'MMMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                      <Rating value={review.rating} />
                      <p className="mt-4">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-muted-foreground">Difficulty</dt>
                  <dd className="font-medium capitalize">{recipe.difficulty}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Prep Time</dt>
                  <dd className="font-medium">{recipe.prep_time}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Cook Time</dt>
                  <dd className="font-medium">{recipe.cook_time}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Servings</dt>
                  <dd className="font-medium">{recipe.servings}</dd>
                </div>
              </dl>
            </div>

            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                <ul className="list-disc list-inside space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {recipe.instructions && recipe.instructions.length > 0 && (
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            )}

            {recipe.tips && recipe.tips.length > 0 && (
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
    </div>
  );
};

export default ArticleDetail;