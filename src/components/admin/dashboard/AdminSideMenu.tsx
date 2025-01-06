import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileText,
  Menu,
  Star,
  MessageSquare,
  Award
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminSideMenuProps {
  className?: string;
}

const AdminSideMenu = ({ className }: AdminSideMenuProps) => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard/admin",
      label: "Overview",
      icon: LayoutDashboard
    },
    {
      path: "/dashboard/admin/users",
      label: "Users",
      icon: Users
    },
    {
      path: "/dashboard/admin/recipes",
      label: "Recipes",
      icon: FileText
    },
    {
      path: "/dashboard/admin/menus",
      label: "Menu Management",
      icon: Menu
    },
    {
      path: "/dashboard/admin/reviews",
      label: "Reviews",
      icon: Star
    },
    {
      path: "/dashboard/admin/forum",
      label: "Forum",
      icon: MessageSquare
    },
    {
      path: "/dashboard/admin/rewards",
      label: "Rewards",
      icon: Award
    },
    {
      path: "/dashboard/admin/settings",
      label: "Settings",
      icon: Settings
    }
  ];

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