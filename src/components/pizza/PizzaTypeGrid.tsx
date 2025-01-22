import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
        <div
          key={pizzaType.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-48">
            {pizzaType.image_url ? (
              <img
                src={pizzaType.image_url}
                alt={pizzaType.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{pizzaType.name}</h3>
            <p className="text-gray-600">
              {pizzaType.description || "No description available"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PizzaTypeGrid;