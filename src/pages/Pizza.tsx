import React from 'react';
import Navigation from '../components/Navigation';
import { PizzaTypeGrid } from '@/components/pizza/PizzaTypeGrid';

const Pizza = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-20">
        <h1 className="text-3xl font-bold text-textLight mb-8 text-center font-serif">Pizza Types</h1>
        <PizzaTypeGrid />
      </div>
    </div>
  );
};

export default Pizza;