import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import { PizzaStyleRecipes } from '@/components/pizza/PizzaStyleRecipes';
import { Hero } from '@/components/ui/hero-with-image-text-and-two-buttons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoginDialog } from '@/components/LoginDialog';
import { useState, useEffect } from 'react';

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
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes', style],
    queryFn: async () => {
      try {
        console.log('Fetching recipes for style:', style);
        
        const { data: pizzaType, error: pizzaTypeError } = await supabase
          .from('pizza_types')
          .select('id')
          .eq('slug', style)
          .maybeSingle();

        if (pizzaTypeError) {
          console.error('Error fetching pizza type:', pizzaTypeError);
          throw pizzaTypeError;
        }

        console.log('Found pizza type:', pizzaType);

        if (pizzaType?.id) {
          const { data: recipes, error: recipesError } = await supabase
            .from('recipes')
            .select(`
              *,
              categories:category_id (
                name
              )
            `)
            .eq('category_id', pizzaType.id)
            .order('created_at', { ascending: false });

          if (recipesError) {
            console.error('Error fetching recipes:', recipesError);
            throw recipesError;
          }

          console.log('Fetched recipes:', recipes);
          return recipes || [];
        }
        
        return [];
      } catch (error) {
        console.error('Error in query function:', error);
        setQueryError(error instanceof Error ? error.message : 'An unknown error occurred');
        throw error;
      }
    },
    enabled: !!style && !!pizzaStyle,
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load recipes. Please try again later.');
      console.error('Query error:', error);
    }
  }, [error]);

  const handleSubmitRecipe = async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    try {
      const { data: pizzaType, error } = await supabase
        .from('pizza_types')
        .select('id')
        .eq('slug', style)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (pizzaType) {
        navigate('/dashboard', { 
          state: { 
            showRecipeForm: true,
            categoryId: pizzaType.id,
            categoryName: pizzaStyle?.title,
            returnTo: `/pizza/${style}`
          } 
        });
      } else {
        toast.error("Unable to find pizza type. Please try again later.");
      }
    } catch (error) {
      console.error('Error in handleSubmitRecipe:', error);
      toast.error('Failed to prepare recipe form. Please try again later.');
    }
  };

  if (!pizzaStyle) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <h1 className="text-2xl font-bold text-textLight">Style not found</h1>
          <Link to="/pizza" className="text-accent hover:text-highlight">Return to Pizza Styles</Link>
        </div>
      </div>
    );
  }

  const latestImage = recipes?.[0]?.image_url || '/placeholder-pizza.jpg';

  if (queryError) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-20 space-y-8">
          <div>
            <Link to="/pizza" className="inline-flex items-center text-accent hover:text-highlight mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pizza Styles
            </Link>
          </div>
          
          <div className="p-8 border-2 border-red-300 rounded-lg bg-red-50 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
            <p className="text-red-700 mb-4">We're having trouble connecting to our database. Please try again later.</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="destructive"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 space-y-8">
        <div>
          <Link to="/pizza" className="inline-flex items-center text-accent hover:text-highlight mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pizza Styles
          </Link>
        </div>

        <Hero 
          title={pizzaStyle.title}
          description={pizzaStyle.history}
          image={latestImage}
          showButtons={false}
        />

        <div className="flex justify-end mb-8">
          <Button 
            onClick={handleSubmitRecipe}
            className={cn(
              "w-auto py-6 text-lg bg-gradient-to-r text-white transition-all duration-300",
              "shadow-lg hover:shadow-xl rounded-xl relative overflow-hidden hover:scale-[1.02] active:scale-[0.98]",
              "from-admin to-admin-secondary hover:from-admin-hover-DEFAULT hover:to-admin-hover-secondary"
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            Submit Recipe
          </Button>
        </div>
        
        <PizzaStyleRecipes 
          recipes={recipes || []}
          isLoading={isLoading}
        />
      </div>

      {!user && (
        <LoginDialog 
          isOpen={showLoginDialog} 
          onClose={() => setShowLoginDialog(false)} 
        />
      )}
    </div>
  );
};

export default PizzaStyle;