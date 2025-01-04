import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import Navigation from "./Navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import DashboardNavItems from "./dashboard/DashboardNavItems";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isStaff } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex flex-col pt-16">
        <div className="w-full border-b bg-card">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              <div className="hidden md:flex items-center space-x-1">
                <DashboardNavItems 
                  isAdmin={isAdmin}
                  isStaff={isStaff}
                  isMobile={isMobile}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out",
              "top-[8.5rem] h-[calc(100vh-8.5rem)]",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
              "md:hidden"
            )}
          >
            <nav className="flex flex-col p-4 space-y-2">
              <DashboardNavItems 
                isAdmin={isAdmin}
                isStaff={isStaff}
                isMobile={isMobile}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </nav>
          </div>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>

          {isMobile && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 top-[8.5rem]"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;