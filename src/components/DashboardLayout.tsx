import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, MessageSquare, Star } from "lucide-react";
import Navigation from "./Navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isStaff } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 space-y-2">
            <Button
              asChild
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link to="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Overview
              </Link>
            </Button>

            {isAdmin && (
              <Button
                asChild
                variant={isActive("/dashboard/admin") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link to="/dashboard/admin">
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Link>
              </Button>
            )}

            {(isAdmin || isStaff) && (
              <Button
                asChild
                variant={isActive("/dashboard/staff") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link to="/dashboard/staff">
                  <FileText className="mr-2 h-4 w-4" />
                  Recipe Management
                </Link>
              </Button>
            )}

            <Button
              asChild
              variant={isActive("/dashboard/member") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link to="/dashboard/member">
                <Star className="mr-2 h-4 w-4" />
                My Reviews
              </Link>
            </Button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-h-[calc(100vh-8rem)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;