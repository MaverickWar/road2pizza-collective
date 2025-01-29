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
  Menu,
  X,
  Construction
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { SidebarBase } from "@/components/ui/sidebar/SidebarBase";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard/admin" },
  { icon: Users, label: "Users", path: "/dashboard/admin/users" },
  { icon: BookOpen, label: "Recipes", path: "/dashboard/admin/recipes" },
  { icon: Star, label: "Reviews", path: "/dashboard/admin/review-management" },
  { icon: Award, label: "Rewards", path: "/dashboard/admin/rewards" },
  { icon: FileText, label: "Pizza Types", path: "/dashboard/admin/pizza-types" },
  { icon: Bell, label: "Notifications", path: "/dashboard/admin/notifications" },
  { icon: Construction, label: "Under Construction", path: "/dashboard/admin/construction" },
  { icon: Settings, label: "Settings", path: "/dashboard/admin/settings" },
  { icon: Palette, label: "Theme", path: "/dashboard/admin/theme" },
  { icon: Image, label: "Media", path: "/dashboard/admin/media" }
];

export function AdminSidebar({ isOpen, onToggle, isMobile }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}

      <SidebarBase 
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-white border-r border-admin-border shadow-admin transition-all duration-300",
          isOpen && !isMobile ? "w-64" : "w-20",
          isMobile && "transform",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "w-64"
        )}
        position="left"
        panelId="admin-sidebar"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-admin-border">
            <h2 className={cn(
              "font-semibold transition-all duration-300",
              (!isOpen && !isMobile) || (isMobile && !isOpen) ? "opacity-0 w-0" : "opacity-100 text-lg text-admin"
            )}>
              Admin Panel
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-admin/10"
              onClick={onToggle}
            >
              {isMobile && isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && onToggle()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-admin-foreground transition-colors",
                    "hover:bg-admin/10 hover:text-admin",
                    isActive && "bg-admin/10 text-admin font-medium"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className={cn(
                    "transition-all duration-300",
                    (!isOpen && !isMobile) || (isMobile && !isOpen) ? "opacity-0 w-0" : "opacity-100"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </SidebarBase>
    </>
  );
}