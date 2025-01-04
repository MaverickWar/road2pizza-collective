import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Navigation from "./Navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";
import { SidebarProvider } from "./ui/sidebar/SidebarContext";
import { Sidebar } from "./ui/sidebar/SidebarBase";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isStaff } = useAuth();
  const location = useLocation();
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

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      title: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard/admin",
      show: true,
    },
    {
      title: "User Management",
      icon: Users,
      href: "/dashboard/admin/users",
      show: isAdmin,
    },
    {
      title: "Recipe Management",
      icon: FileText,
      href: "/dashboard/staff",
      show: isAdmin || isStaff,
    },
    {
      title: "Reviews Dashboard",
      icon: MessageSquare,
      href: "/dashboard/reviews",
      show: isAdmin || isStaff,
    },
    {
      title: "Forum Settings",
      icon: Settings,
      href: "/dashboard/admin/forum",
      show: isAdmin,
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <Navigation />
      
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen pt-16">
          {/* Mobile Menu Toggle - Repositioned and styled */}
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-[4.5rem] left-4 z-50 md:hidden bg-white shadow-sm hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Sidebar */}
          <Sidebar
            variant="floating"
            className={cn(
              "transition-transform duration-300 ease-in-out z-40",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}
          >
            <div className="flex flex-col h-full p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <nav className="space-y-2 flex-1">
                {navigationItems
                  .filter(item => item.show)
                  .map((item) => (
                    <Button
                      key={item.href}
                      asChild
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => isMobile && setIsSidebarOpen(false)}
                    >
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4 mr-2" />
                        <span>{item.title}</span>
                      </Link>
                    </Button>
                  ))}
              </nav>
            </div>
          </Sidebar>

          {/* Main Content */}
          <main className={cn(
            "flex-1 transition-all duration-300 ease-in-out p-6",
            isSidebarOpen ? "md:ml-64" : "ml-0"
          )}>
            {children}
          </main>

          {/* Mobile Overlay */}
          {isMobile && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;