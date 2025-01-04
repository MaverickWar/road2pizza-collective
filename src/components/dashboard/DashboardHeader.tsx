import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { useAuth } from "@/components/AuthProvider";
import { Shield } from "lucide-react";

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const DashboardHeader = ({ 
  isSidebarOpen, 
  setIsSidebarOpen 
}: DashboardHeaderProps) => {
  const { user } = useAuth();

  return (
    <div className="w-full px-6 py-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mx-4"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Admin Access</span>
        </div>
      </div>
    </div>
  );
};