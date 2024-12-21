import React from 'react';
import Navigation from '../Navigation';

const ArticleLoading = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-secondary rounded w-1/3"></div>
            <div className="h-4 bg-secondary rounded w-1/4"></div>
            <div className="h-[300px] bg-secondary rounded"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleLoading;