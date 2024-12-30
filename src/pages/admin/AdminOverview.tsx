import AdminLayout from "@/components/admin/layout/AdminLayout";
import StatsOverview from "@/components/admin/dashboard/StatsOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Pizza, Star, MessageSquare, Award, FileText } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      href: "/admin/users",
      color: "text-blue-500",
    },
    {
      title: "Pizza Types",
      description: "Manage pizza varieties",
      icon: Pizza,
      href: "/admin/pizza-types",
      color: "text-orange-500",
    },
    {
      title: "Reviews",
      description: "Moderate user reviews",
      icon: Star,
      href: "/admin/reviews",
      color: "text-yellow-500",
    },
    {
      title: "Forum",
      description: "Manage community discussions",
      icon: MessageSquare,
      href: "/admin/forum",
      color: "text-purple-500",
    },
    {
      title: "Rewards",
      description: "Configure badges and points",
      icon: Award,
      href: "/admin/rewards",
      color: "text-green-500",
    },
    {
      title: "Pages",
      description: "Manage content pages",
      icon: FileText,
      href: "/admin/pages",
      color: "text-indigo-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => (
        <Card key={action.href} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
            <action.icon className={`w-4 h-4 ${action.color}`} />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {action.description}
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to={action.href}>Manage</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AdminOverview = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome to your pizza community dashboard
          </p>
        </div>
        <StatsOverview />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <QuickActions />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;