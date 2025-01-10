import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import AdminSideMenu from "./admin/dashboard/AdminSideMenu";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  const queryClient = useQueryClient();

  // Reset relevant queries on route change
  useEffect(() => {
    console.log("Route changed in DashboardLayout:", location.pathname);
    // Remove stale data for admin-related queries
    queryClient.removeQueries({ queryKey: ["admin-users"] });
    queryClient.removeQueries({ queryKey: ["admin-reviews"] });
    queryClient.removeQueries({ queryKey: ["admin-recipes"] });
    queryClient.removeQueries({ queryKey: ["admin-stats"] });
  }, [location.pathname, queryClient]);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

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

          <div className={cn(
            "admin-sidebar fixed top-0 left-0 h-full w-64 bg-background border-r border-admin-border transition-transform duration-300 ease-in-out z-40",
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

          <main className={cn(
            "transition-all duration-300 ease-in-out",
            "min-h-screen bg-background",
            "p-4 md:p-6",
            "md:ml-64", // Always offset content on desktop
            isMobile && !isSidebarOpen && "ml-0", // No offset on mobile when menu is closed
            "flex flex-col"
          )}>
            {children}
          </main>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;