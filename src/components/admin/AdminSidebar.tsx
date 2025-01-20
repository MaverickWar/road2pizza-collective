import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Star, 
  Award,
  FileText,
  Bell,
  Settings,
  Palette,
  Image,
  Menu
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/ui/sidebar/SidebarBase";
import { useSidebar } from "@/components/ui/sidebar/SidebarContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard/admin" },
  { icon: Users, label: "Users", path: "/dashboard/admin/users" },
  { icon: BookOpen, label: "Recipes", path: "/dashboard/admin/recipes" },
  { icon: Star, label: "Reviews", path: "/dashboard/admin/review-management" },
  { icon: Award, label: "Rewards", path: "/dashboard/admin/rewards" },
  { icon: FileText, label: "Pizza Types", path: "/dashboard/admin/pizza-types" },
  { icon: Bell, label: "Notifications", path: "/dashboard/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/dashboard/admin/settings" },
  { icon: Palette, label: "Theme", path: "/dashboard/admin/theme" },
  { icon: Image, label: "Media", path: "/dashboard/admin/media" }
];

export function AdminSidebar() {
  const location = useLocation();
  const { state, toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  
  return (
    <Sidebar 
      className={cn(
        "fixed top-0 left-0 z-50 h-screen bg-white border-r border-admin-border shadow-admin transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        isMobile && "w-64"
      )}
      side="left"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-admin-border">
          <h2 className={cn(
            "font-semibold transition-all duration-300",
            (collapsed && !isMobile) ? "opacity-0 w-0" : "opacity-100 text-lg text-admin"
          )}>
            Admin Panel
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-admin/10"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setOpenMobile(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-admin-foreground transition-colors",
                  "hover:bg-admin/10 hover:text-admin",
                  isActive && "bg-admin/10 text-admin font-medium"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className={cn(
                  "transition-all duration-300",
                  (collapsed && !isMobile) ? "opacity-0 w-0" : "opacity-100"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </Sidebar>
  );
}