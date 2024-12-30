import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Pizza,
  Settings,
  Shield,
  BookOpen,
  Users,
  Star,
  MessageSquare,
  Award,
  FileText,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Pizza Types",
    href: "/admin/pizza-types",
    icon: Pizza,
  },
  {
    title: "Recipes",
    href: "/admin/recipes",
    icon: BookOpen,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Forum",
    href: "/admin/forum",
    icon: MessageSquare,
  },
  {
    title: "Rewards",
    href: "/admin/rewards",
    icon: Award,
  },
  {
    title: "Pages",
    href: "/admin/pages",
    icon: FileText,
  },
  {
    title: "Moderation",
    href: "/admin/moderation",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const AdminNav = () => {
  const location = useLocation();

  return (
    <nav className="flex-1 px-2 mt-6 space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isActive && "bg-secondary hover:bg-secondary/80"
            )}
          >
            <Link to={item.href} className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              {item.title}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};

export default AdminNav;