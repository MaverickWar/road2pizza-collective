import { LayoutDashboard, Users, Star, MessageSquare, Settings, FileText, BookOpen, Award, Pizza, Bell, Palette, Image } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard/admin" },
  { icon: Users, label: "Users", path: "/dashboard/admin/users" },
  { icon: Star, label: "Reviews", path: "/dashboard/admin/reviews" },
  { icon: FileText, label: "Review Management", path: "/dashboard/admin/review-management" },
  { icon: MessageSquare, label: "Forum Categories", path: "/dashboard/admin/forum/categories" },
  { icon: MessageSquare, label: "Forum Threads", path: "/dashboard/admin/forum/threads" },
  { icon: Settings, label: "Forum Settings", path: "/dashboard/admin/forum/settings" },
  { icon: BookOpen, label: "Recipes", path: "/dashboard/admin/recipes" },
  { icon: Award, label: "Rewards", path: "/dashboard/admin/rewards" },
  { icon: Pizza, label: "Pizza Types", path: "/dashboard/admin/pizza-types" },
  { icon: Bell, label: "Notifications", path: "/dashboard/admin/notifications" },
  { icon: Palette, label: "Theme", path: "/dashboard/admin/theme" },
  { icon: Image, label: "Media", path: "/dashboard/admin/media" },
];

const AdminSideMenu = () => {
  return (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminSideMenu;