import React, { Suspense } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import LoadingScreen from '@/components/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

const Index = () => {
  console.log('Rendering Index page');
  const { reset } = useQueryErrorResetBoundary();

  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary onReset={reset}>
        <Navigation />
        <Suspense fallback={<LoadingScreen />}>
          <main>
            <Hero />
            <div className="mt-4 md:mt-6">
              <FeaturedPosts />
            </div>
          </main>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Index;