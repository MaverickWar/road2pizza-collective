import { Recipe } from "@/components/recipe/types";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Rating } from "@/components/Rating";

interface RecipeContentProps {
  recipe: Recipe;
}

const RecipeContent = ({ recipe }: RecipeContentProps) => {
  return (
    <div className="space-y-6">
      {recipe?.status === 'unpublished' && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
          This recipe is unpublished. You may not have access to view it.
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4">{recipe?.title}</h1>
      
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
    </div>
  );
};

export default RecipeContent;