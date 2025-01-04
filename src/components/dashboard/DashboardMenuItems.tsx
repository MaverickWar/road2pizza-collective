import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare,
  Settings,
  Star,
  Award,
  Bell,
  Palette,
  Image,
  Navigation,
  Trophy,
  Pizza
} from 'lucide-react';
import { useAuth } from "@/components/AuthProvider";

interface MenuItemProps {
  href: string;
  isActive: boolean;
  onClick: (href: string) => void;
  icon: React.ElementType;
  title: string;
}

const MenuItem = ({ href, isActive, onClick, icon: Icon, title }: MenuItemProps) => (
  <Button
    key={href}
    variant={isActive ? "secondary" : "ghost"}
    className="w-full justify-start"
    onClick={() => onClick(href)}
  >
    <Icon className="h-4 w-4 mr-2" />
    <span>{title}</span>
  </Button>
);

export const getNavigationItems = (isAdmin: boolean, isStaff: boolean) => [
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
    icon: FileText,
    href: "/dashboard/admin/recipes",
    show: isAdmin || isStaff,
  },
  {
    title: "Reviews Dashboard",
    icon: Star,
    href: "/dashboard/admin/reviews",
    show: isAdmin || isStaff,
  },
  {
    title: "Pizza Types",
    icon: Pizza,
    href: "/dashboard/admin/pizza-types",
    show: isAdmin || isStaff,
  },
  {
    title: "Forum Settings",
    icon: MessageSquare,
    href: "/dashboard/admin/forum",
    show: isAdmin,
  },
  {
    title: "Rewards System",
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
    title: "Theme Settings",
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
    title: "Navigation",
    icon: Navigation,
    href: "/dashboard/admin/navigation",
    show: isAdmin,
  },
  {
    title: "Achievements",
    icon: Trophy,
    href: "/dashboard/admin/achievements",
    show: isAdmin,
  },
  {
    title: "Site Settings",
    icon: Settings,
    href: "/dashboard/admin/settings",
    show: isAdmin,
  },
];

export const DashboardMenuItems = ({ 
  isActive, 
  handleNavigation 
}: { 
  isActive: (path: string) => boolean;
  handleNavigation: (href: string) => void;
}) => {
  const { isAdmin, isStaff } = useAuth();
  const navigationItems = getNavigationItems(isAdmin, isStaff);

  return (
    <nav className="space-y-2">
      {navigationItems
        .filter(item => item.show)
        .map((item) => (
          <MenuItem
            key={item.href}
            href={item.href}
            isActive={isActive(item.href)}
            onClick={handleNavigation}
            icon={item.icon}
            title={item.title}
          />
        ))}
    </nav>
  );
};