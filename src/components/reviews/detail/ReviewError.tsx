import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';

export const ReviewError = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Review not found</h1>
          <Button
            variant="ghost"
            onClick={() => navigate('/reviews')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reviews
          </Button>
        </div>
      </div>
    </>
  );
};