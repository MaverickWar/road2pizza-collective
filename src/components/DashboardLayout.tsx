import React from 'react';
import Navigation from './Navigation';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuth();
  const { isMobile, isSidebarOpen, setIsSidebarOpen } = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Change Navigation z-index to be higher than sidebar */}
      <div className="relative z-[60]">
        <Navigation />
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row pt-16">
        {isAdmin && user && (
          <>
            <div
              className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out",
                "top-[7rem] md:top-[4rem] h-[calc(100vh-7rem)] md:h-[calc(100vh-4rem)]",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                "md:relative md:translate-x-0 md:h-[calc(100vh-4rem)] md:min-h-screen"
              )}
            >
              {/* Rest of sidebar content */}
            </div>
            {isMobile && isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-30 top-[7rem] md:top-[4rem]"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
          </>
        )}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;