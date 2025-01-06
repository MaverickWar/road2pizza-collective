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
  Image
} from 'lucide-react';
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard/admin" },
  { icon: Users, label: "Users", path: "/dashboard/admin/users" },
  { icon: BookOpen, label: "Recipes", path: "/dashboard/admin/recipes" },
  { icon: Star, label: "Reviews", path: "/dashboard/reviews" },
  { icon: Award, label: "Rewards", path: "/dashboard/admin/rewards" },
  { icon: FileText, label: "Pizza Types", path: "/dashboard/admin/pizza-types" },
  { icon: Bell, label: "Notifications", path: "/dashboard/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/dashboard/admin/settings" },
  { icon: Palette, label: "Theme", path: "/dashboard/admin/theme" },
  { icon: Image, label: "Media", path: "/dashboard/admin/media" }
];

const AdminSideMenu = () => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold px-2">Admin Dashboard</h2>
      </div>
      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start font-medium transition-colors",
                "hover:bg-secondary/80",
                isActive && "bg-secondary hover:bg-secondary"
              )}
            >
              <Link to={item.path} className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSideMenu;