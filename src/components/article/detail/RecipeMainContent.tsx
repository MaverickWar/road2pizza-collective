import { Card } from "@/components/ui/card";
import type { Recipe } from "@/components/recipe/types";
import MediaGallery from "../MediaGallery";
import AuthorCard from "../AuthorCard";

interface RecipeMainContentProps {
  recipe: Recipe;
}

const RecipeMainContent = ({ recipe }: RecipeMainContentProps) => {
  return (
    <div className="space-y-6">
      <AuthorCard author={recipe.profiles} />
      
      <MediaGallery 
        imageUrl={recipe.image_url}
        videoUrl={recipe.video_url}
        videoProvider={recipe.video_provider}
        images={Array.isArray(recipe.images) ? recipe.images : []}
      />

      <Card className="p-6">
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: recipe.content || '' }} />
        </div>
      </Card>
    </div>
  );
};

export default RecipeMainContent;