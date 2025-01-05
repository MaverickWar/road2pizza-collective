import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import Navigation from "./Navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import AdminSideMenu from "./admin/dashboard/AdminSideMenu";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
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
      
      <div className="flex flex-col pt-16">
        <div className="flex flex-1">
          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out",
              "top-[4rem] h-[calc(100vh-4rem)]",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
              "md:translate-x-0 md:static md:h-auto"
            )}
          >
            <div className="p-4">
              <AdminSideMenu />
            </div>
          </div>

          {/* Main content */}
          <main className={cn(
            "flex-1 p-6 transition-all duration-300",
            isSidebarOpen && !isMobile ? "md:ml-64" : ""
          )}>
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="flex md:hidden"
                >
                  {isSidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              </div>
              {children}
            </div>
          </main>

          {/* Mobile overlay */}
          {isMobile && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 top-[4rem]"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;