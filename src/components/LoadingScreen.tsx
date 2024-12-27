import { Pizza } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  duration?: number;
  showWelcome?: boolean;
}

const LoadingScreen = ({ duration = 3000, showWelcome = false }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 50; // Update every 50ms
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
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center space-x-3 group mb-8">
          <div className="w-12 h-12 bg-transparent border-2 border-accent rounded-full flex items-center justify-center">
            <Pizza className="w-7 h-7 text-accent" />
          </div>
          <span className="text-accent font-light text-2xl tracking-wider">
            Road2Pizza
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-accent/20" />
            <div 
              className="absolute inset-0 rounded-full border-4 border-accent transition-all duration-300"
              style={{
                clipPath: `polygon(50% 50%, -50% -50%, ${progress * 3.6}deg, ${progress * 3.6}deg, -50% -50%)`,
                transform: 'rotate(-90deg)',
              }}
            />
            <div className="relative p-8">
              <Pizza className="w-16 h-16 text-accent animate-[spin_3s_linear_infinite]" />
            </div>
          </div>
          <p className="text-accent font-light text-xl">
            {Math.round(progress)}%
          </p>
        </div>

        {showWelcome && (
          <p className="text-accent/80 text-center mt-8 max-w-md animate-fade-up">
            Welcome to Road2Pizza - Online pizza community for pizza enthusiasts!
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;