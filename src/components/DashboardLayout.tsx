import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Pizza,
  Bell,
  MessageSquare,
  Settings,
  Image,
  FileText,
  Palette,
  Menu,
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
      show: isAdmin,
    },
    {
      title: "User Management",
      icon: Users,
      href: "/dashboard/admin/users",
      show: isAdmin,
    },
    {
      title: "Pizza Types",
      icon: Pizza,
      href: "/dashboard/admin/pizza-types",
      show: isAdmin,
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/dashboard/admin/notifications",
      show: isAdmin,
    },
    {
      title: "Forum Management",
      icon: MessageSquare,
      href: "/dashboard/admin/forum",
      show: isAdmin,
    },
    {
      title: "Site Settings",
      icon: Settings,
      href: "/dashboard/admin/settings",
      show: isAdmin,
    },
    {
      title: "Navigation",
      icon: Menu,
      href: "/dashboard/admin/navigation",
      show: isAdmin,
    },
    {
      title: "Theme",
      icon: Palette,
      href: "/dashboard/admin/theme",
      show: isAdmin,
    },
    {
      title: "Media Gallery",
      icon: Image,
      href: "/dashboard/admin/media",
      show: isAdmin,
    },
    {
      title: "Pages",
      icon: FileText,
      href: "/dashboard/admin/pages",
      show: isAdmin,
    },
    {
      title: "Recipe Management",
      icon: FileText,
      href: "/dashboard/staff",
      show: isStaff && !isAdmin,
    },
    {
      title: "Reviews Dashboard",
      icon: MessageSquare,
      href: "/dashboard/reviews",
      show: isStaff && !isAdmin,
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <Navigation />
      
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen pt-16">
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

          <main className={cn(
            "flex-1 transition-all duration-300 ease-in-out p-6",
            isSidebarOpen ? "md:ml-64" : "ml-0"
          )}>
            {children}
          </main>

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