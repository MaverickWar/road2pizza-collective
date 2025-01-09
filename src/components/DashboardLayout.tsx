import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import AdminSideMenu from "./admin/dashboard/AdminSideMenu";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      "admin-layout",
      !isSidebarOpen && "collapsed"
    )}>
      {isAdmin && user && (
        <>
          <div className="admin-sidebar">
            <div className="p-4 h-16 flex items-center justify-between border-b border-admin-border">
              <h1 className="text-xl font-bold text-admin">Road2Pizza Admin</h1>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="md:hidden"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="p-4 h-[calc(100vh-4rem)] overflow-y-auto">
              <AdminSideMenu />
            </div>
          </div>

          <header className="admin-header">
            <div className="px-4 h-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="hover:bg-admin/10"
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

      <main className="admin-content">
        <div className="container p-6 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;