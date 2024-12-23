import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import FeaturedPosts from '../components/FeaturedPosts';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-32">
        <Hero />
        <FeaturedPosts />
      </main>
    </div>
  );
};

export default Index;