import { Recipe } from "@/components/recipe/types";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/Rating";
import AuthorCard from "./AuthorCard";
import MediaGallery from "./MediaGallery";
import { cn } from "@/lib/utils";

interface RecipeContentProps {
  recipe: Recipe;
}

const RecipeContent = ({ recipe }: RecipeContentProps) => {
  const averageRating = recipe.reviews?.length 
    ? recipe.reviews.reduce((acc, review) => acc + review.rating, 0) / recipe.reviews.length
    : 0;

  const isNewRecipe = (createdAt: string) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(createdAt) > oneMonthAgo;
  };

  return (
    <div className="space-y-8">
      {recipe?.status === 'unpublished' && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
          This recipe is unpublished. You may not have access to view it.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold">{recipe?.title}</h1>
          
          {averageRating > 0 && (
            <div className="flex items-center">
              <Rating value={averageRating} />
              <span className="ml-2 text-sm text-gray-500">
                ({recipe.reviews?.length} {recipe.reviews?.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <div className="relative">
            {/* Ribbon */}
            {(recipe.is_featured || (recipe.created_at && isNewRecipe(recipe.created_at))) && (
              <div className="absolute top-0 left-0 z-10 overflow-hidden h-24 w-24">
                <div className={cn(
                  "absolute top-[20px] left-[-45px] w-[170px] text-center py-2 -rotate-45",
                  "text-white text-sm font-semibold shadow-lg",
                  recipe.is_featured 
                    ? "bg-admin text-white" 
                    : "bg-white text-admin border border-admin/20"
                )}>
                  {recipe.is_featured ? "Featured" : "New"}
                </div>
              </div>
            )}
            
            <MediaGallery 
              imageUrl={recipe.image_url}
              videoUrl={recipe.video_url}
              videoProvider={recipe.video_provider}
              images={Array.isArray(recipe.images) ? recipe.images : []}
            />
          </div>

          <Card className="p-6 bg-card">
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: recipe.content || '' }} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <AuthorCard author={recipe.profiles} />
          
          <Card className="p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
            <div className="space-y-2">
              <p><strong>Prep Time:</strong> {recipe.prep_time}</p>
              <p><strong>Cook Time:</strong> {recipe.cook_time}</p>
              <p><strong>Servings:</strong> {recipe.servings}</p>
              <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            </div>
          </Card>

          {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
            <Card className="p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
              <ul className="list-disc list-inside space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </Card>
          )}

          {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
            <Card className="p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              <ol className="list-decimal list-inside space-y-2">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </Card>
          )}

          {Array.isArray(recipe.tips) && recipe.tips.length > 0 && (
            <Card className="p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
              <ul className="list-disc list-inside space-y-2">
                {recipe.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeContent;