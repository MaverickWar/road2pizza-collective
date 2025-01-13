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
          {/* Sidebar with Logo */}
          <div className={cn(
            "admin-sidebar fixed top-0 left-0 h-screen w-64 bg-white border-r border-admin-border transition-transform duration-300 ease-in-out z-50",
            !isSidebarOpen && "md:translate-x-0",
            !isSidebarOpen && isMobile && "-translate-x-full"
          )}>
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-6">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="h-8 w-8"
                />
                <span className="font-semibold text-lg">Admin Dashboard</span>
              </div>
              <AdminSideMenu />
            </div>
          </div>

          {/* Top Navigation Bar */}
          <div className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-admin-border z-40 transition-all duration-300">
            <div className="flex items-center justify-between h-full px-4">
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

          <main className={cn(
            "transition-all duration-300 ease-in-out",
            "min-h-screen bg-background",
            "p-4 md:p-6",
            "pt-24", // Increased top padding to prevent content from being cut off
            "md:ml-64",
            isMobile && !isSidebarOpen && "ml-0",
            "flex flex-col gap-6"
          )}>
            {children}
          </main>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;