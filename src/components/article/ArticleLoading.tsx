import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const ArticleLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in-50 duration-500">
      <div className="mb-6">
        <Skeleton className="h-10 w-40" />
      </div>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-48" />
        </div>
        
        <Skeleton className="h-[400px] w-full rounded-lg" />
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
          
          <div className="space-y-6">
            <Skeleton className="h-[200px] rounded-lg" />
            <Skeleton className="h-[150px] rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleLoading;