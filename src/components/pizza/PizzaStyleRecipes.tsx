
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Recipe {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  difficulty?: string;
  prep_time?: string;
  created_at: string;
  is_featured?: boolean;
}

interface PizzaStyleRecipesProps {
  recipes: Recipe[];
  isLoading: boolean;
}

export const PizzaStyleRecipes = ({ recipes, isLoading }: PizzaStyleRecipesProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up', 'opacity-100');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    itemsRef.current.forEach((item) => {
      if (item) {
        observerRef.current?.observe(item);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [recipes]);

  const getImageUrl = (url: string) => {
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
      <h2 className="text-3xl font-bold text-textLight mb-8 text-center font-serif animate-fade-up">Recipes</h2>
      <div className="border-4 border-admin/20 rounded-xl p-8 bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <div
              key={recipe.id}
              ref={(el) => (itemsRef.current[index] = el)}
              className="opacity-0 transform translate-y-4"
              style={{ 
                transitionDelay: `${index * 100}ms`,
                transitionDuration: '500ms',
                transitionProperty: 'all'
              }}
            >
              <Link
                to={`/article/${recipe.id}`}
                className="group relative bg-secondary rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="relative">
                  {/* Ribbon */}
                  {(recipe.is_featured || isNewRecipe(recipe.created_at)) && (
                    <div className="absolute top-0 left-0 z-10 overflow-hidden h-24 w-24">
                      <div className={cn(
                        "absolute top-[20px] left-[-45px] w-[170px] text-center py-2 -rotate-45",
                        "text-white text-sm font-semibold shadow-lg transition-all duration-300",
                        recipe.is_featured 
                          ? "bg-admin text-white" 
                          : "bg-white text-admin border border-admin/20"
                      )}>
                        {recipe.is_featured ? "Featured" : "New"}
                      </div>
                    </div>
                  )}
                  
                  <div className="aspect-video relative overflow-hidden">
                    {/* Blur thumbnail while loading */}
                    <div
                      className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
                      style={{
                        backgroundImage: `url(${recipe.image_url ? getImageUrl(recipe.image_url) : '/placeholder.svg'})`,
                      }}
                    />
                    
                    {/* Main image */}
                    <img
                      src={recipe.image_url ? getImageUrl(recipe.image_url) : '/placeholder.svg'}
                      alt={recipe.title}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '1';
                        target.previousElementSibling?.remove(); // Remove blur thumbnail
                      }}
                      style={{ opacity: 0 }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-textLight mb-2 group-hover:text-accent transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-textLight mb-4 line-clamp-2">
                      {recipe.content?.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between text-sm text-textLight">
                      <span>Difficulty: {recipe.difficulty}</span>
                      <span>Prep: {recipe.prep_time}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
