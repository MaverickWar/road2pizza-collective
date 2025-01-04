import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare,
  Settings,
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
    icon: MessageSquare,
    href: "/dashboard/admin/reviews",
    show: isAdmin || isStaff,
  },
  {
    title: "Pizza Types",
    icon: FileText,
    href: "/dashboard/admin/pizza-types",
    show: isAdmin || isStaff,
  },
  {
    title: "Forum Settings",
    icon: Settings,
    href: "/dashboard/admin/forum",
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