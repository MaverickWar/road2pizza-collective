import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminSideMenuProps {
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  display_order: number;
}

const AdminSideMenu = ({ className }: AdminSideMenuProps) => {
  const location = useLocation();
  
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      console.log('Fetching admin menu items...');
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('requires_admin', true)
        .order('display_order');
      
      if (error) {
        console.error('Error fetching menu items:', error);
        throw error;
      }
      
      return data as MenuItem[];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  // Fallback to overview if no menu items
  if (!menuItems?.length) {
    return (
      <nav className={cn("space-y-2", className)}>
        <Button
          asChild
          variant={location.pathname === "/dashboard/admin" ? "secondary" : "ghost"}
          className="w-full justify-start"
        >
          <Link to="/dashboard/admin">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span>Overview</span>
          </Link>
        </Button>
      </nav>
    );
  }

  return (
    <nav className={cn("space-y-2", className)}>
      {menuItems.map((item) => {
        // Dynamically import icon from lucide-react
        const IconComponent = require('lucide-react')[item.icon];
        
        return (
          <Button
            key={item.id}
            asChild
            variant={location.pathname === item.path ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link to={item.path}>
              {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
              <span>{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};

export default AdminSideMenu;