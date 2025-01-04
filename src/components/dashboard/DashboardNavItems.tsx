import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare,
  Settings,
  Image,
  Palette,
  Bell,
  Award,
  BookOpen,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  show: boolean;
}

interface DashboardNavItemsProps {
  isAdmin: boolean;
  isStaff: boolean;
  isMobile: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const DashboardNavItems = ({ isAdmin, isStaff, isMobile, setIsSidebarOpen }: DashboardNavItemsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
      title: "Recipe Management",
      icon: BookOpen,
      href: "/dashboard/admin/recipes",
      show: isAdmin || isStaff,
    },
    {
      title: "Reviews Dashboard",
      icon: MessageSquare,
      href: "/dashboard/reviews",
      show: isAdmin || isStaff,
    },
    {
      title: "Pizza Types",
      icon: FileText,
      href: "/dashboard/admin/pizza-types",
      show: isAdmin || isStaff,
    },
    {
      title: "Rewards",
      icon: Award,
      href: "/dashboard/admin/rewards",
      show: isAdmin,
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/dashboard/admin/notifications",
      show: isAdmin,
    },
    {
      title: "Media Gallery",
      icon: Image,
      href: "/dashboard/admin/media",
      show: isAdmin,
    },
    {
      title: "Theme Settings",
      icon: Palette,
      href: "/dashboard/admin/theme",
      show: isAdmin,
    },
    {
      title: "Forum Settings",
      icon: Settings,
      href: "/dashboard/admin/forum",
      show: isAdmin,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return navigationItems
    .filter(item => item.show)
    .map((item) => (
      <Button
        key={item.href}
        variant={isActive(item.href) ? "secondary" : "ghost"}
        className="justify-start"
        onClick={() => handleNavigation(item.href)}
      >
        <item.icon className="h-4 w-4 mr-2" />
        <span>{item.title}</span>
      </Button>
    ));
};

export default DashboardNavItems;