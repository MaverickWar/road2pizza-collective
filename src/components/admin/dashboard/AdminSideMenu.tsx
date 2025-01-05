import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
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
  { icon: Star, label: "Pizza Oven Reviews", path: "/dashboard/admin/reviews" },
  { icon: Award, label: "Rewards", path: "/dashboard/admin/rewards" },
  { icon: FileText, label: "Pizza Types", path: "/dashboard/admin/pizza-types" },
  { icon: Bell, label: "Notifications", path: "/dashboard/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/dashboard/admin/settings" },
  { icon: Palette, label: "Theme", path: "/dashboard/admin/theme" },
  { icon: Image, label: "Media", path: "/dashboard/admin/media" }
];

interface AdminSideMenuProps {
  className?: string;
}

const AdminSideMenu = ({ className }: AdminSideMenuProps) => {
  const location = useLocation();
  
  return (
    <nav className={cn("space-y-2", className)}>
      {menuItems.map((item) => (
        <Button
          key={item.path}
          asChild
          variant={location.pathname === item.path ? "secondary" : "ghost"}
          className="w-full justify-start"
        >
          <Link to={item.path}>
            <item.icon className="h-4 w-4 mr-2" />
            <span>{item.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
};

export default AdminSideMenu;