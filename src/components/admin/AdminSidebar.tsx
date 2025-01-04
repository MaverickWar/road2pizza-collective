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
import { Sidebar } from "@/components/ui/sidebar/SidebarBase";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard/admin" },
  { icon: Users, label: "Users", path: "/dashboard/admin/users" },
  { icon: BookOpen, label: "Recipes", path: "/dashboard/admin/recipes" },
  { icon: Star, label: "Reviews", path: "/dashboard/admin/reviews" },
  { icon: Award, label: "Rewards", path: "/dashboard/admin/rewards" },
  { icon: FileText, label: "Pizza Types", path: "/dashboard/admin/pizza-types" },
  { icon: Bell, label: "Notifications", path: "/dashboard/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/dashboard/admin/settings" },
  { icon: Palette, label: "Theme", path: "/dashboard/admin/theme" },
  { icon: Image, label: "Media", path: "/dashboard/admin/media" }
];

export function AdminSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="w-64 border-r bg-background">
      <div className="flex flex-col h-full p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </div>
        <nav className="space-y-2 flex-1">
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
      </div>
    </Sidebar>
  );
}