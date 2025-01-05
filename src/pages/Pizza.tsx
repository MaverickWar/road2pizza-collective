import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import PizzaTypeGrid from '@/components/pizza/PizzaTypeGrid';

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

  const handleAddPizzaType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('pizza_types')
        .insert([{
          ...newType,
          slug: newType.name.toLowerCase().replace(/\s+/g, '-'),
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
          <PizzaTypeGrid />
        </div>
      </div>
    </div>
  );
};

export default Pizza;