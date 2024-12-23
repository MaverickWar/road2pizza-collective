import React, { Suspense } from 'react';
import Navigation from '../components/Navigation';
import { Skeleton } from '@/components/ui/skeleton';

const Hero = React.lazy(() => import('../components/Hero'));
const FeaturedPosts = React.lazy(() => import('../components/FeaturedPosts'));

const LoadingFallback = () => (
  <div className="space-y-8 p-8">
    <Skeleton className="h-[60vh] w-full" />
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex flex-col w-full">
        <Suspense fallback={<LoadingFallback />}>
          <Hero />
          <div className="mt-8 md:mt-12">
            <FeaturedPosts />
          </div>
        </Suspense>
      </main>
    </div>
  );
};

export default Index;