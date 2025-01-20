import React from 'react';
import Hero from '../components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';

const Index = () => {
  console.log('Rendering Index page');

  return (
    <>
      <Hero />
      <div className="container mx-auto px-4">
        <FeaturedPosts />
      </div>
    </>
  );
};

export default Index;