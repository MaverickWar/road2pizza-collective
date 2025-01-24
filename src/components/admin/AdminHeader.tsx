import { useAuth } from "@/components/AuthProvider";
import { Bell, Menu, Search } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 z-40 bg-white border-b border-dashboard-border transition-all duration-300">
      <div className="h-16 px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-dashboard-muted hover:text-dashboard-primary"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dashboard-muted" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-[300px] bg-dashboard-background border-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-dashboard-muted hover:text-dashboard-primary relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
          </Button>

          {user && <UserMenu user={user} isAdmin={true} />}
        </div>
      </div>
    </header>
  );
};