import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import Navigation from "./Navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import AdminSideMenu from "./admin/dashboard/AdminSideMenu";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Set initial sidebar state based on screen size
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const toggleSidebar = () => {
    console.log('Toggling sidebar. Current state:', isSidebarOpen);
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex flex-col md:flex-row pt-16">
        {/* Only render sidebar for admin users */}
        {isAdmin && user && (
          <>
            <div
              className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out",
                "top-[7rem] md:top-[4rem] h-[calc(100vh-7rem)] md:h-[calc(100vh-4rem)]",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                "md:relative md:translate-x-0 md:h-[calc(100vh-4rem)] md:min-h-screen"
              )}
            >
              <div className="p-4 h-full overflow-y-auto">
                <AdminSideMenu />
              </div>
            </div>

            {/* Mobile overlay */}
            {isMobile && isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 top-[7rem] md:top-[4rem]"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
          </>
        )}

        {/* Main content */}
        <main className={cn(
          "flex-1 transition-all duration-300 min-h-screen",
          "px-4 md:px-8 lg:px-12",
          "py-4 md:py-6 lg:py-8",
          "w-full max-w-full"
        )}>
          <div className="max-w-[1600px] mx-auto space-y-4">
            {isAdmin && user && (
              <div className="flex items-center justify-between mb-4 mt-3 md:mt-0">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="md:hidden hover:bg-accent/10"
                    aria-label="Toggle menu"
                  >
                    {isSidebarOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Admin Dashboard</h1>
                </div>
              </div>
            )}
            <div className="grid gap-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;