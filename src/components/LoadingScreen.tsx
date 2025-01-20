import { Pizza } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  duration?: number;
  showWelcome?: boolean;
}

const LoadingScreen = ({ duration = 2000, showWelcome = false }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 20; // Update every 20ms for smoother animation
    const steps = duration / interval;
    const increment = 100 / steps;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto p-6">
        <div className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-transparent border-2 border-accent rounded-full flex items-center justify-center">
            <Pizza className="w-7 h-7 text-accent animate-spin" />
          </div>
          <span className="text-accent font-light text-2xl tracking-wider animate-pulse">
            Road2Pizza
          </span>
        </div>

        <div className="w-full space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground">
            {showWelcome ? 'Welcome back!' : 'Loading...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;