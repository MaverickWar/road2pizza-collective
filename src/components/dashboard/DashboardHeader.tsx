import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const DashboardHeader = ({ 
  isSidebarOpen, 
  setIsSidebarOpen 
}: DashboardHeaderProps) => {
  return (
    <div className="w-full px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-secondary/50 p-6 rounded-lg backdrop-blur-sm animate-fade-up flex-grow">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your dashboard
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};