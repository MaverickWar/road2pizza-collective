import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import PizzaTypeCard from './PizzaTypeCard';
import { useAuth } from '@/components/AuthProvider';

interface PizzaType {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  display_order: number;
  is_hidden: boolean;
}

const PizzaTypeGrid = () => {
  const { isAdmin, isStaff } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const showControls = isAdmin || isStaff;

  const { data: pizzaTypes, isLoading } = useQuery({
    queryKey: ['pizzaTypes'],
    queryFn: async () => {
      console.log('Fetching pizza types...');
      const query = supabase
        .from('pizza_types')
        .select('*')
        .order('display_order');

      // Only filter out hidden items for non-admin/staff users
      if (!isAdmin && !isStaff) {
        query.eq('is_hidden', false);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching pizza types:', error);
        throw error;
      }

      console.log('Fetched pizza types:', data);
      return data as PizzaType[];
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, newOrder, name, slug }: { id: string; newOrder: number; name: string; slug: string }) => {
      const { error } = await supabase
        .from('pizza_types')
        .update({ display_order: newOrder, name, slug })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzaTypes'] });
    },
    onError: (error) => {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  });

  const handleReorder = async (id: string, currentOrder: number, direction: 'up' | 'down') => {
    if (!pizzaTypes) return;
    
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find the item that needs to swap positions
    const itemToSwap = pizzaTypes.find(type => type.display_order === newOrder);
    if (!itemToSwap) return;

    // Update both items
    await Promise.all([
      updateOrderMutation.mutateAsync({ 
        id, 
        newOrder,
        name: pizzaTypes.find(t => t.id === id)?.name || '',
        slug: pizzaTypes.find(t => t.id === id)?.slug || ''
      }),
      updateOrderMutation.mutateAsync({ 
        id: itemToSwap.id, 
        newOrder: currentOrder,
        name: itemToSwap.name,
        slug: itemToSwap.slug
      })
    ]);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-gray-300 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pizzaTypes?.map((type, index) => (
        <PizzaTypeCard
          key={type.id}
          id={type.id}
          name={type.name}
          description={type.description || ''}
          imageUrl={type.image_url || ''}
          slug={type.slug}
          displayOrder={type.display_order}
          isFirst={index === 0}
          isLast={index === (pizzaTypes.length - 1)}
          showControls={showControls}
          onReorder={handleReorder}
          onDelete={() => queryClient.invalidateQueries({ queryKey: ['pizzaTypes'] })}
        />
      ))}
    </div>
  );
};

export default PizzaTypeGrid;