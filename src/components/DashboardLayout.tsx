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

          {/* Sidebar */}
          <div className={cn(
            "admin-sidebar",
            !isSidebarOpen && "translate-x-[-100%] md:translate-x-0 md:w-20",
            "transition-all duration-300 ease-in-out"
          )}>
            <div className="p-4 h-16 flex items-center justify-between border-b border-admin-border">
              <h1 className={cn(
                "text-xl font-bold text-admin transition-opacity duration-300",
                !isSidebarOpen && "md:opacity-0"
              )}>
                Road2Pizza Admin
              </h1>
            </div>
            <div className="p-4 h-[calc(100vh-4rem)] overflow-y-auto">
              <AdminSideMenu />
            </div>
          </div>

          {/* Header */}
          <header className={cn(
            "admin-header",
            !isSidebarOpen && "md:left-20",
            "transition-all duration-300 ease-in-out"
          )}>
            <div className="px-4 h-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Desktop Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="hidden md:flex hover:bg-admin/10"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                {/* Add header actions here */}
              </div>
            </div>
          </header>
        </>
      )}

      {/* Main Content */}
      <main className={cn(
        "admin-content",
        !isSidebarOpen && "md:pl-20",
        "transition-all duration-300 ease-in-out"
      )}>
        <div className="container p-6 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;