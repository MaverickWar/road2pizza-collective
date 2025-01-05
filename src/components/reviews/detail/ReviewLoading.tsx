import Navigation from '@/components/Navigation';

export const ReviewLoading = () => {
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/3"></div>
          <div className="h-4 bg-secondary rounded w-1/4"></div>
          <div className="h-[300px] bg-secondary rounded"></div>
        </div>
      </div>
    </>
  );
};