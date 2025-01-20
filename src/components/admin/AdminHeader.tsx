import { useAuth } from "@/components/AuthProvider";
import { Shield, Home, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar/SidebarContext";
import { cn } from "@/lib/utils";

export const AdminHeader = () => {
  const { user } = useAuth();
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <div className="fixed top-0 right-0 left-0 z-50 bg-admin-gradient shadow-admin">
      <div className="p-3 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
              <Link 
                to="/" 
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5",
                  "bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm",
                  "hover:bg-white/20 transition-colors w-fit"
                )}
              >
                <Home className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white whitespace-nowrap">Return to Site</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white whitespace-nowrap">Admin Access</span>
            </div>
            {user && <UserMenu user={user} isAdmin={true} />}
          </div>
        </div>
      </div>
    </div>
  );
};