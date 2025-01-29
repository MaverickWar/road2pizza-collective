import React from 'react';
import Hero from '../components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';

const Index = () => {
  console.log('Rendering Index page');

  return (
    <>
      <Hero />
      <FeaturedPosts />
    </>
  );
};

export default Index;