import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';

const Index = () => {
  console.log('Rendering Index page');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="h-[calc(100vh-64px)]">
        <Hero />
        <div className="mt-4 md:mt-6">
          <FeaturedPosts />
        </div>
      </main>
    </div>
  );
};

export default Index;