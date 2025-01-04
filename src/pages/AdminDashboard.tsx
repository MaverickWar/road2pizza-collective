import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Settings,
  Award,
  FileText,
  Bell,
  Palette,
  Image,
  LayoutDashboard,
  Navigation,
  Trophy
} from 'lucide-react';
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();

  const adminCards = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      href: "/dashboard/admin/users",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Recipe Management",
      description: "Manage and approve recipes",
      icon: BookOpen,
      href: "/dashboard/admin/recipes",
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Reviews Dashboard",
      description: "Monitor and manage user reviews",
      icon: MessageSquare,
      href: "/dashboard/admin/reviews",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Rewards System",
      description: "Configure badges and points",
      icon: Award,
      href: "/dashboard/admin/rewards",
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      title: "Pizza Types",
      description: "Manage pizza categories",
      icon: FileText,
      href: "/dashboard/admin/pizza-types",
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      title: "Navigation",
      description: "Manage site navigation",
      icon: Navigation,
      href: "/dashboard/admin/navigation",
      color: "bg-red-500/10 text-red-500",
    },
    {
      title: "Theme Settings",
      description: "Customize site appearance",
      icon: Palette,
      href: "/dashboard/admin/theme",
      color: "bg-indigo-500/10 text-indigo-500",
    },
    {
      title: "Media Gallery",
      description: "Manage uploaded media",
      icon: Image,
      href: "/dashboard/admin/media",
      color: "bg-pink-500/10 text-pink-500",
    },
    {
      title: "Site Settings",
      description: "Configure global settings",
      icon: Settings,
      href: "/dashboard/admin/settings",
      color: "bg-slate-500/10 text-slate-500",
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => (
            <Link key={card.title} to={card.href}>
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                <CardHeader className="space-y-1">
                  <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center mb-2`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;