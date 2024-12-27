import { Pizza } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Pizza className="w-16 h-16 text-accent animate-[spin_3s_linear_infinite]" />
        <p className="text-accent font-light text-xl animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;