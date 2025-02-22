
import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import PizzaTypeGrid from '@/components/pizza/PizzaTypeGrid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';

const Pizza = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-textLight font-serif animate-fade-up">Pizza Types</h1>
          {isAdmin && (
            <Button 
              onClick={() => navigate('/dashboard/admin/pizza-types')}
              className="flex items-center gap-2 animate-fade-up"
            >
              <Plus className="w-4 h-4" />
              Manage Pizza Types
            </Button>
          )}
        </div>
        <Suspense fallback={<PizzaGridSkeleton />}>
          <PizzaTypeGrid />
        </Suspense>
      </div>
    </div>
  );
};

const PizzaGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} className="aspect-square rounded-lg" />
    ))}
  </div>
);

export default Pizza;
