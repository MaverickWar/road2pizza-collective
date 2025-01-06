import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';

const Index = () => {
  console.log('Rendering Index page');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <div className="mt-8 md:mt-12">
          <FeaturedPosts />
        </div>
      </main>
    </div>
  );
};

export default Index;