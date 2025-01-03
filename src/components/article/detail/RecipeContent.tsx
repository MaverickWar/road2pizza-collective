import { Recipe } from "@/components/recipe/types";

interface RecipeContentProps {
  recipe: Recipe;
}

const RecipeContent = ({ recipe }: RecipeContentProps) => {
  return (
    <div className="prose prose-lg prose-gray max-w-none">
      <div dangerouslySetInnerHTML={{ __html: recipe.content || '' }} />
    </div>
  );
};

export default RecipeContent;