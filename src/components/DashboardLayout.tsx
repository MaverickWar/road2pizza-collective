import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare,
  Settings,
  Menu,
  X
} from 'lucide-react';
import Navigation from "./Navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isStaff } = useAuth();
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

  console.log("Current route:", location.pathname);
  console.log("Mobile menu state:", { isMobile, isSidebarOpen });

  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex flex-col pt-16">
        <div className="w-full px-6 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-secondary/50 p-6 rounded-lg backdrop-blur-sm animate-fade-up">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome to your dashboard
              </p>
            </div>
          </div>
        </div>

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
                {navigationItems
                  .filter(item => item.show)
                  .map((item) => (
                    <Button
                      key={item.href}
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className="h-12"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </Button>
                  ))}
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
              {navigationItems
                .filter(item => item.show)
                .map((item) => (
                  <Button
                    key={item.href}
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className="justify-start"
                    onClick={() => handleNavigation(item.href)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </Button>
                ))}
            </nav>
          </div>

          <main className="flex-1 p-6">
            {children}
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