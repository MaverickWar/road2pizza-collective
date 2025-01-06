import React, { Suspense } from 'react';
import Navigation from '../components/Navigation';
import { Skeleton } from '@/components/ui/skeleton';
import FeaturedPosts from '@/components/FeaturedPosts';

const Hero = React.lazy(() => import('../components/Hero'));

const LoadingFallback = () => (
  <div className="space-y-8 p-8">
    <Skeleton className="h-[60vh] w-full rounded-xl" />
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3 rounded-lg" />
      <Skeleton className="h-4 w-2/3 rounded-lg" />
    </div>
  </div>
);

const Index = () => {
  console.log('Rendering Index page');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Hero />
        </Suspense>
        <div className="mt-8 md:mt-12">
          <FeaturedPosts />
        </div>
      </main>
    </div>
  );
};

export default Index;