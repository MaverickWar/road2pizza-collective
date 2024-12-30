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
  Palette,
  Type,
  Layout,
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
    title: "Appearance",
    href: "/admin/appearance",
    icon: Palette,
  },
  {
    title: "Typography",
    href: "/admin/typography",
    icon: Type,
  },
  {
    title: "Layout",
    href: "/admin/layout",
    icon: Layout,
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
    <nav className="flex-1 space-y-1 overflow-y-auto">
      <div className="px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-1",
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
      </div>
    </nav>
  );
};

export default AdminNav;