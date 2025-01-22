import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface PizzaType {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
  slug: string;
  display_order: number;
  is_hidden: boolean;
}

const PizzaTypeGrid = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pizzaTypes, isLoading, error } = useQuery({
    queryKey: ['pizzaTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pizza_types')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        throw error;
      }
      return data as PizzaType[];
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    toast({
      title: "Error loading pizza types",
      description: "Please try again later",
      variant: "destructive"
    });
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pizzaTypes?.map((pizzaType) => (
        <Link
          key={pizzaType.id}
          to={`/pizza/${pizzaType.slug}`}
          className="block relative overflow-hidden rounded-lg aspect-square hover:transform hover:scale-105 transition-transform duration-300"
        >
          <img
            src={pizzaType.image_url || '/placeholder.svg'}
            alt={pizzaType.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white mb-2">{pizzaType.name}</h3>
            <p className="text-sm text-gray-200">{pizzaType.description || 'No description available'}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PizzaTypeGrid;