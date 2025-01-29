import React from 'react';
import Hero from '../components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import MainLayout from '@/components/MainLayout';

const Index = () => {
  console.log('Rendering Index page');

  return (
    <MainLayout>
      <Hero />
      <FeaturedPosts />
    </MainLayout>
  );
};

export default Index;