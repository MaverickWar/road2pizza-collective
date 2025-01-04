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
  X
} from 'lucide-react';
import Navigation from "./Navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-mobile";

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

  console.log("Mobile menu state:", { isMobile, isSidebarOpen });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex min-h-[calc(100vh-4rem)] pt-16">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-16 left-4 z-50 md:hidden p-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

        {/* Sidebar */}
        <div
          className={cn(
            "fixed md:static top-16 left-0 h-[calc(100vh-4rem)] w-64 transform transition-transform duration-300 ease-in-out bg-background border-r shadow-sm",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "md:translate-x-0"
          )}
        >
          <div className="flex flex-col h-full p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Dashboard</h2>
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
        </div>

        {/* Main Content */}
        <main className={cn(
          "flex-1 p-6 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-0" : "ml-0"
        )}>
          {children}
        </main>

        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;