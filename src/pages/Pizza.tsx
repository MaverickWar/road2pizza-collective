import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface PizzaType {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  display_order: number;
}

const Pizza = () => {
  const { isAdmin, isStaff } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newType, setNewType] = useState({
    name: '',
    description: '',
    image_url: '',
    slug: ''
  });

  const { data: pizzaTypes, isLoading } = useQuery({
    queryKey: ['pizzaTypes'],
    queryFn: async () => {
      console.log('Fetching pizza types...');
      const { data, error } = await supabase
        .from('pizza_types')
        .select('*')
        .order('display_order');

      if (error) {
        console.error('Error fetching pizza types:', error);
        throw error;
      }

      console.log('Fetched pizza types:', data);
      return data as PizzaType[];
    }
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('pizza_types')
        .update({ display_order: newOrder })
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
      updateOrderMutation.mutateAsync({ id, newOrder }),
      updateOrderMutation.mutateAsync({ id: itemToSwap.id, newOrder: currentOrder })
    ]);
  };

  const handleAddPizzaType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const maxOrder = pizzaTypes ? Math.max(...pizzaTypes.map(type => type.display_order), -1) : -1;
      const { error } = await supabase
        .from('pizza_types')
        .insert([{
          ...newType,
          slug: newType.name.toLowerCase().replace(/\s+/g, '-'),
          display_order: maxOrder + 1
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pizza type added successfully",
      });
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['pizzaTypes'] });
      setNewType({ name: '', description: '', image_url: '', slug: '' });
    } catch (error) {
      console.error('Error adding pizza type:', error);
      toast({
        title: "Error",
        description: "Failed to add pizza type",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-36 md:pt-32">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-36 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-textLight">Pizza Styles</h1>
            {(isAdmin || isStaff) && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Pizza Style
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Pizza Style</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddPizzaType} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={newType.name}
                        onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={newType.description}
                        onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newType.image_url}
                        onChange={(e) => setNewType({ ...newType, image_url: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Add Pizza Style</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pizzaTypes?.map((type) => (
              <div key={type.id} className="relative">
                {(isAdmin || isStaff) && (
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleReorder(type.id, type.display_order, 'up')}
                      disabled={type.display_order === Math.min(...pizzaTypes.map(t => t.display_order))}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleReorder(type.id, type.display_order, 'down')}
                      disabled={type.display_order === Math.max(...pizzaTypes.map(t => t.display_order))}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <Link
                  to={`/pizza/${type.slug}`}
                  className="group relative overflow-hidden rounded-lg aspect-square hover:transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={type.image_url}
                    alt={type.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-textLight mb-2">{type.name}</h3>
                    <p className="text-sm text-gray-300">{type.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pizza;