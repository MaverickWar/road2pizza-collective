import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface PizzaType {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
}

const Pizza = () => {
  const { isAdmin, isStaff } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newType, setNewType] = useState({
    name: '',
    description: '',
    image_url: '',
    slug: ''
  });

  const { data: pizzaTypes, isLoading, refetch } = useQuery({
    queryKey: ['pizzaTypes'],
    queryFn: async () => {
      console.log('Fetching pizza types...');
      const { data, error } = await supabase
        .from('pizza_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching pizza types:', error);
        throw error;
      }

      console.log('Fetched pizza types:', data);
      return data as PizzaType[];
    }
  });

  const handleAddPizzaType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('pizza_types')
        .insert([{
          ...newType,
          slug: newType.name.toLowerCase().replace(/\s+/g, '-')
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pizza type added successfully",
      });
      setIsAddDialogOpen(false);
      refetch();
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
              <Link
                key={type.id}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pizza;