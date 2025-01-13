import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu, X, Home } from 'lucide-react';
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import AdminSideMenu from "./admin/dashboard/AdminSideMenu";
import { useLocation, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { UserMenu } from "./UserMenu";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Route changed in DashboardLayout:", location.pathname);
    if (location.pathname.includes('analytics')) {
      queryClient.removeQueries({ queryKey: ["analytics-metrics"] });
    } else if (location.pathname.includes('users')) {
      queryClient.removeQueries({ queryKey: ["admin-users"] });
    } else if (location.pathname.includes('reviews')) {
      queryClient.removeQueries({ queryKey: ["admin-reviews"] });
    } else if (location.pathname.includes('recipes')) {
      queryClient.removeQueries({ queryKey: ["admin-recipes"] });
    }
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
          {/* Top Navigation Bar */}
          <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-admin-border z-50">
            <div className="flex items-center justify-between h-full max-w-screen-2xl mx-auto px-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="md:hidden hover:bg-admin/10"
                  aria-label="Toggle menu"
                >
                  {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="bg-white shadow-sm"
                  aria-label="Back to site"
                >
                  <Link to="/">
                    <Home className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              {/* User Menu */}
              <div className="flex items-center gap-4">
                {user && <UserMenu user={user} isAdmin={isAdmin} />}
              </div>
            </div>
          </div>

          <div className={cn(
            "admin-sidebar fixed top-0 left-0 h-screen w-64 bg-white border-r border-admin-border transition-transform duration-300 ease-in-out z-40",
            !isSidebarOpen && "md:translate-x-0",
            !isSidebarOpen && isMobile && "-translate-x-full"
          )}>
            <div className="p-4 h-full overflow-y-auto">
              <AdminSideMenu />
            </div>
          </div>

          <main className={cn(
            "transition-all duration-300 ease-in-out",
            "min-h-screen bg-background",
            "p-4 md:p-6",
            "pt-24", // Increased padding top to account for the fixed header
            "md:ml-64", // Always offset content on desktop
            isMobile && !isSidebarOpen && "ml-0", // No offset on mobile when menu is closed
            "flex flex-col gap-6" // Added gap for consistent spacing
          )}>
            {children}
          </main>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;