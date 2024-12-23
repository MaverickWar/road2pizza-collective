import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import FeaturedPosts from '../components/FeaturedPosts';

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <Navigation />
      <main className="flex flex-col w-full">
        <Hero />
        <div className="mt-8 md:mt-12">
          <FeaturedPosts />
        </div>
      </main>
    </div>
  );
};

export default Index;