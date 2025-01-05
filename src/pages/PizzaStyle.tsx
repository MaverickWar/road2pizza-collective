import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

const pizzaStyles = {
  "neapolitan": {
    title: "Neapolitan Pizza",
    description: "The original pizza from Naples, characterized by its thin base, high crust, and minimal toppings. Cooked at very high temperatures in a wood-fired oven.",
    history: "Dating back to the 18th century in Naples, Italy, this style is considered the original pizza. Traditional Neapolitan pizza has a thin crust with a fluffy, charred cornicione (rim).",
  },
  "new-york": {
    title: "New York Style Pizza",
    description: "Large, foldable slices with a crispy outer crust and chewy interior. Known for its perfect balance of sauce and cheese.",
    history: "Developed by Italian immigrants in New York City in the early 1900s, this style became an iconic symbol of the city's food culture.",
  },
  "detroit": {
    title: "Detroit Style Pizza",
    description: "Square pizza with a thick, crispy crust, typically topped with Wisconsin brick cheese and sauce on top.",
    history: "Originally baked in automotive parts trays in the 1940s, Detroit-style pizza is known for its unique rectangular shape and crispy bottom.",
  },
  "chicago": {
    title: "Chicago Deep Dish",
    description: "Deep, thick pizza with high edges, layered with cheese, meat, vegetables, and sauce on top.",
    history: "Invented at Pizzeria Uno in 1943, Chicago deep dish was designed to be a more filling and substantial meal.",
  },
  "sicilian": {
    title: "Sicilian Pizza",
    description: "Thick-crust, rectangular pizza with robust toppings and a focaccia-like base.",
    history: "Derived from sfincione, a type of focaccia from Sicily, this style was brought to America by Sicilian immigrants.",
  },
  "thin-crispy": {
    title: "Thin & Crispy Pizza",
    description: "Ultra-thin, crispy crust with light toppings, often with a cracker-like consistency.",
    history: "Popular in bars and restaurants across America, this style emphasizes crispiness and simplicity.",
  },
  "american": {
    title: "American Pizza",
    description: "Classic American-style with various toppings, typically featuring a medium-thick crust.",
    history: "A fusion of various styles that developed across America, incorporating diverse regional influences.",
  },
  "other": {
    title: "Other Pizza Styles",
    description: "Discover unique and fusion pizza styles from around the world.",
    history: "Pizza continues to evolve globally, with each region adding its own twist to this beloved dish.",
  }
};

const PizzaStyle = () => {
  const { style } = useParams();
  const pizzaStyle = pizzaStyles[style as keyof typeof pizzaStyles];
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes', style],
    queryFn: async () => {
      console.log('Fetching recipes for style:', style);
      
      const { data: categories, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', `%${pizzaStyle?.title}%`)
        .maybeSingle();

      if (categoryError) {
        console.error('Error fetching category:', categoryError);
        throw categoryError;
      }

      console.log('Found category:', categories);

      if (categories?.id) {
        const { data: recipes, error: recipesError } = await supabase
          .from('recipes')
          .select(`
            *,
            categories (
              name
            )
          `)
          .eq('category_id', categories.id);

        if (recipesError) {
          console.error('Error fetching recipes:', recipesError);
          throw recipesError;
        }

        console.log('Fetched recipes:', recipes);
        return recipes || [];
      }
      
      return [];
    },
    enabled: !!style && !!pizzaStyle,
  });

  const handleSubmitRecipe = async () => {
    if (!user) {
      toast.error("Please login to submit a recipe");
      navigate("/login");
      return;
    }

    // Get category ID for the current pizza style
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', `%${pizzaStyle?.title}%`)
      .maybeSingle();

    if (category) {
      navigate('/dashboard', { 
        state: { 
          showRecipeForm: true,
          categoryId: category.id,
          categoryName: pizzaStyle?.title 
        } 
      });
    } else {
      toast.error("Unable to find category. Please try again later.");
    }
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('data:') || url.startsWith('http')) {
      return url;
    }
    return new URL(url, window.location.origin).href;
  };

  if (!pizzaStyle) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-36 md:pt-32">
          <h1 className="text-2xl font-bold text-textLight">Style not found</h1>
          <Link to="/pizza" className="text-accent hover:text-highlight">Return to Pizza Styles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-36 md:pt-32">
        <Link to="/pizza" className="inline-flex items-center text-accent hover:text-highlight mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pizza Styles
        </Link>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-textLight mb-4">{pizzaStyle.title}</h1>
            <p className="text-xl text-textLight">{pizzaStyle.description}</p>
          </div>
          <Button 
            onClick={handleSubmitRecipe}
            className="bg-accent hover:bg-accent-hover text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Submit Recipe
          </Button>
        </div>
        
        <div className="bg-secondary rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-textLight mb-4">History</h2>
          <p className="text-textLight">{pizzaStyle.history}</p>
        </div>

        <h2 className="text-2xl font-bold text-textLight mb-6">Recipes</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-secondary rounded-lg p-4 animate-pulse">
                <div className="aspect-video bg-muted rounded mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : recipes && recipes.length > 0 ? (
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
        ) : (
          <p className="text-textLight">No recipes available for this style yet.</p>
        )}
      </div>
    </div>
  );
};

export default PizzaStyle;