
import React, { Suspense } from 'react';
import Hero from '../components/Hero';
import FeaturedPosts from '@/components/FeaturedPosts';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  console.log('Rendering Index page');

  return (
    <div className="animate-fade-in">
      <Suspense fallback={<Skeleton className="h-[600px]" />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<FeaturedPostsSkeleton />}>
        <FeaturedPosts />
      </Suspense>
    </div>
  );
};

const FeaturedPostsSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-8 w-64 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Index;
