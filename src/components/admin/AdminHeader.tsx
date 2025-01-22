import { useAuth } from "@/components/AuthProvider";
import { Shield, Home, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-0 z-40 bg-admin-gradient shadow-admin transition-all duration-300">
      <div className="p-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 h-8 w-8"
              onClick={onMenuClick}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <Link 
              to="/" 
              className={cn(
                "inline-flex items-center justify-center",
                "w-8 h-8 rounded-lg bg-white/10 border border-white/20",
                "hover:bg-white/20 transition-colors"
              )}
            >
              <Home className="w-4 h-4 text-white" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2 py-1 bg-white/10 rounded-lg border border-white/20">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Admin</span>
            </div>
            {user && <UserMenu user={user} isAdmin={true} />}
          </div>
        </div>
      </div>
    </header>
  );
};