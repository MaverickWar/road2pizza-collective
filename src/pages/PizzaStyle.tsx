import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import { PizzaStyleHeader } from '@/components/pizza/PizzaStyleHeader';
import { PizzaStyleRecipes } from '@/components/pizza/PizzaStyleRecipes';
import { Hero } from '@/components/ui/hero-with-image-text-and-two-buttons';


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
          .eq('category_id', categories.id)
          .order('created_at', { ascending: false });

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
      navigate("/login", { 
        state: { 
          returnTo: `/pizza/${style}`,
          message: "Please login to submit a recipe" 
        } 
      });
      return;
    }

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
          categoryName: pizzaStyle?.title,
          returnTo: `/pizza/${style}`
        } 
      });
    } else {
      toast.error("Unable to find category. Please try again later.");
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

  const latestImage = recipes?.[0]?.image_url || '/placeholder.svg';

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 space-y-8">
        <div>
          <Link to="/pizza" className="inline-flex items-center text-accent hover:text-highlight mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pizza Styles
          </Link>
          
          <PizzaStyleHeader 
            title={pizzaStyle.title}
            description={pizzaStyle.description}
            onSubmitRecipe={handleSubmitRecipe}
          />
        </div>

        <Hero 
          title={pizzaStyle.title}
          description={pizzaStyle.history}
          image={latestImage}
          showButtons={false}
        />
        
        <PizzaStyleRecipes 
          recipes={recipes || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PizzaStyle;
