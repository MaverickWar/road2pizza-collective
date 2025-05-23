import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Recipe {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  difficulty?: string | null;
  prep_time?: string | null;
  created_at: string;
  is_featured?: boolean | null;
  categories?: {
    name: string;
  } | null;
}

interface PizzaStyleRecipesProps {
  recipes: Recipe[];
  isLoading: boolean;
}

export const PizzaStyleRecipes = ({ recipes, isLoading }: PizzaStyleRecipesProps) => {
  const getImageUrl = (url: string | null) => {
    if (!url) return '/placeholder.svg';
    if (url.startsWith('data:') || url.startsWith('http')) {
      return url;
    }
    return new URL(url, window.location.origin).href;
  };

  const isNewRecipe = (createdAt: string) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(createdAt) > oneMonthAgo;
  };

  const getContentPreview = (content: string | null) => {
    if (!content) return "No description available";
    
    // If content is HTML, strip tags for preview
    if (content.includes('<')) {
      const div = document.createElement('div');
      div.innerHTML = content;
      const text = div.textContent || div.innerText || '';
      return text.substring(0, 100) + '...';
    }
    
    // Plain text content
    return content.substring(0, 100) + '...';
  };

  if (isLoading) {
    return (
      <div className="border-4 border-admin/20 rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-secondary rounded-lg p-4 animate-pulse">
              <div className="aspect-video bg-muted rounded mb-4" />
              <div className="h-6 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!recipes.length) {
    return (
      <div className="border-4 border-admin/20 rounded-xl p-8">
        <p className="text-textLight">No recipes available for this style yet.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-textLight mb-8 text-center font-serif">Recipes</h2>
      <div className="border-4 border-admin/20 rounded-xl p-8 bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/article/${recipe.id}`}
              className="group relative bg-secondary rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                {/* Ribbon */}
                {(recipe.is_featured || isNewRecipe(recipe.created_at)) && (
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
                
                <div className="aspect-video relative">
                  <img
                    src={recipe.image_url ? getImageUrl(recipe.image_url) : '/placeholder.svg'}
                    alt={recipe.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-textLight mb-2">{recipe.title}</h3>
                  <p className="text-textLight mb-4">
                    {getContentPreview(recipe.content)}
                  </p>
                  <div className="flex justify-between text-sm text-textLight">
                    <span>Difficulty: {recipe.difficulty || 'Any'}</span>
                    <span>Prep: {recipe.prep_time || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};