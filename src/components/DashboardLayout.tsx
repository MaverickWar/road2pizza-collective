import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import Navigation from "./Navigation";
import { DashboardMenuItems } from "./dashboard/DashboardMenuItems";
import { DashboardHeader } from "./dashboard/DashboardHeader";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  const isActive = (path: string) => {
    console.log(`Checking if ${path} matches ${location.pathname}`);
    return location.pathname === path;
  };

  const handleNavigation = (href: string) => {
    console.log("Attempting navigation to:", href);
    try {
      if (location.pathname === href) {
        console.log("Already on this page, skipping navigation");
        return;
      }

      console.log("Navigating to:", href);
      navigate(href);
      
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex flex-col pt-16">
        <DashboardHeader 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex flex-1 relative">
          {/* Sidebar overlay */}
          {isMobile && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out",
              "top-[8.5rem] h-[calc(100vh-8.5rem)]",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="p-4">
              <DashboardMenuItems 
                isActive={isActive}
                handleNavigation={handleNavigation}
              />
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;