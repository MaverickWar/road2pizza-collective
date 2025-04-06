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
import RecipeSubmissionDialog from "@/components/recipe/RecipeSubmissionDialog";

interface PizzaStyle {
  id: string;
  name: string;
  description: string | null;
  history?: string | null;
  slug: string;
}

const PizzaStyle = () => {
  const { user } = useAuth();
  const { style } = useParams();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [pizzaStyle, setPizzaStyle] = useState<PizzaStyle | null>(null);

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes', style],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          reviews (
            rating,
            content,
            user_id,
            created_at,
            profiles (username)
          ),
          profiles (
            username,
            points,
            badge_title,
            badge_color,
            recipes_shared,
            created_at
          )
        `)
        .eq('category_id', pizzaStyle?.id)
        .eq('status', 'published')
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!pizzaStyle?.id,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    const fetchPizzaStyle = async () => {
      try {
        const { data: pizzaType, error } = await supabase
          .from('pizza_types')
          .select('id, name, description, history, slug')
          .eq('slug', style)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (pizzaType && 
            'id' in pizzaType && 
            'name' in pizzaType && 
            'description' in pizzaType && 
            'slug' in pizzaType) {
          setPizzaStyle(pizzaType as PizzaStyle);
        } else {
          setQueryError('Pizza style not found');
        }
      } catch (error) {
        console.error('Error fetching pizza style:', error);
        setQueryError('Failed to load pizza style');
      }
    };

    fetchPizzaStyle();
  }, [style]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching recipes:', error);
      setQueryError('Failed to load recipes');
    }
  }, [error]);

  const handleSubmitRecipe = async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (pizzaStyle) {
      setShowRecipeDialog(true);
    } else {
      toast.error("Unable to find pizza type. Please try again later.");
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
          title={pizzaStyle.name}
          description={pizzaStyle.description || ''}
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

      <RecipeSubmissionDialog
        isOpen={showRecipeDialog}
        onClose={() => setShowRecipeDialog(false)}
        pizzaTypeId={pizzaStyle.id}
        pizzaTypeName={pizzaStyle.name}
      />
    </div>
  );
};

export default PizzaStyle;