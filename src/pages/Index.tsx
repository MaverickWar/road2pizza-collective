import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import FeaturedPosts from '../components/FeaturedPosts';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF9F9] to-[#FFDEE2] dark:from-background dark:to-secondary">
      <Navigation />
      <main>
        <Hero />
        <FeaturedPosts />
      </main>
    </div>
  );
};

export default Index;