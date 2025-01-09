import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import AdminSideMenu from "./admin/dashboard/AdminSideMenu";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    <div className={cn(
      "admin-layout relative min-h-screen bg-admin-background",
      !isSidebarOpen && "collapsed"
    )}>
      {isAdmin && user && (
        <>
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "fixed top-4 left-4 z-50 md:hidden",
              "hover:bg-admin/10"
            )}
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Sidebar - Non-collapsible on desktop */}
          <div className={cn(
            "admin-sidebar fixed top-0 left-0 h-full w-64 bg-white border-r border-admin-border z-40",
            "transition-transform duration-300 ease-in-out",
            !isSidebarOpen && "md:translate-x-0",
            !isSidebarOpen && isMobile && "-translate-x-full"
          )}>
            <div className="p-4 h-16 flex items-center justify-between border-b border-admin-border">
              <h1 className="text-xl font-bold text-admin">
                Road2Pizza Admin
              </h1>
            </div>
            <div className="p-4 h-[calc(100vh-4rem)] overflow-y-auto">
              <AdminSideMenu />
            </div>
          </div>

          {/* Main Content */}
          <main className={cn(
            "admin-content transition-all duration-300 ease-in-out",
            "md:ml-64", // Always offset content on desktop
            isMobile && !isSidebarOpen && "ml-0" // No offset on mobile when menu is closed
          )}>
            <div className="min-h-screen bg-gray-50">
              <div className="p-6">
                {children}
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;