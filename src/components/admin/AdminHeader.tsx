import { useAuth } from "@/components/AuthProvider";
import { Shield, Home, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar/SidebarContext";
import { cn } from "@/lib/utils";

export const AdminHeader = () => {
  const { user } = useAuth();
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  return (
    <div className="fixed top-0 right-0 left-0 z-40 bg-admin-gradient shadow-admin">
      <div className="p-2 md:p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 h-8 w-8"
                onClick={() => setOpenMobile(!openMobile)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-white">Admin Dashboard</h1>
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
    </div>
  );
}