import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import PizzaTypeGrid from '@/components/pizza/PizzaTypeGrid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const Pizza = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-textLight font-serif">Pizza Types</h1>
          {isAdmin && (
            <Button 
              onClick={() => navigate('/dashboard/admin/pizza-types')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Manage Pizza Types
            </Button>
          )}
        </div>
        <PizzaTypeGrid />
      </div>
    </div>
  );
};

export default Pizza;