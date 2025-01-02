import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Navigation from "./Navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isStaff } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

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
      <div className="container mx-auto px-4 pt-36 md:pt-32">
        <div className="flex">
          {/* Collapsible Sidebar */}
          <aside 
            className={cn(
              "fixed left-0 top-32 h-[calc(100vh-8rem)] bg-card border-r transition-all duration-300 ease-in-out",
              collapsed ? "w-16" : "w-64"
            )}
          >
            <div className="flex flex-col h-full p-4">
              <div className="space-y-2 flex-1">
                {navigationItems
                  .filter(item => item.show)
                  .map((item) => (
                    <Button
                      key={item.href}
                      asChild
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Link to={item.href}>
                        <item.icon className={cn(
                          "h-4 w-4",
                          !collapsed && "mr-2"
                        )} />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </Button>
                  ))}
              </div>
              
              {/* Collapse Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="mt-auto"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className={cn(
            "flex-1 min-h-[calc(100vh-8rem)] transition-all duration-300 ease-in-out",
            collapsed ? "ml-16" : "ml-64"
          )}>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;