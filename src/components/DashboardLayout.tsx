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

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Close sidebar when route changes on mobile
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
      
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 left-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      <div className="container mx-auto px-4 pt-32 md:pt-28">
        <div className="flex">
          {/* Sidebar */}
          <aside 
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r pt-28 transition-transform duration-300 ease-in-out md:translate-x-0",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
              isMobile && "shadow-xl"
            )}
          >
            <div className="flex flex-col h-full p-4">
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
          </aside>

          {/* Main Content */}
          <main className={cn(
            "flex-1 transition-all duration-300 ease-in-out min-h-[calc(100vh-8rem)]",
            isSidebarOpen ? "md:ml-64" : "ml-0"
          )}>
            <div className="p-4 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;