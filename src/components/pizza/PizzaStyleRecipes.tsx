import { Link } from "react-router-dom";

interface Recipe {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  difficulty?: string;
  prep_time?: string;
}

interface PizzaStyleRecipesProps {
  recipes: Recipe[];
  isLoading: boolean;
}

export const PizzaStyleRecipes = ({ recipes, isLoading }: PizzaStyleRecipesProps) => {
  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.svg';
    if (url.startsWith('data:') || url.startsWith('http')) {
      return url;
    }
    return new URL(url, window.location.origin).href;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-secondary rounded-lg p-4 animate-pulse">
            <div className="aspect-video bg-muted rounded mb-4" />
            <div className="h-6 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!recipes.length) {
    return <p className="text-textLight">No recipes available for this style yet.</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-textLight mb-6">Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            to={`/article/${recipe.id}`}
            className="bg-secondary rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300"
          >
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
                {recipe.content?.substring(0, 100)}...
              </p>
              <div className="flex justify-between text-sm text-textLight">
                <span>Difficulty: {recipe.difficulty}</span>
                <span>Prep: {recipe.prep_time}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};