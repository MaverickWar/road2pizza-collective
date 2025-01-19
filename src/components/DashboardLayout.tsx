import { useAuthState } from "@/hooks/useAuthState";
import AdminHeader from "./admin/AdminHeader";
import { AdminSidebar } from "./admin/AdminSidebar";
import AdminFooter from "./admin/AdminFooter";
import { useLocation, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { UserMenu } from "./UserMenu";
import { SidebarProvider } from "@/components/ui/sidebar/SidebarBase";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuthState();
  const location = useLocation();
  const queryClient = useQueryClient();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-admin-background w-full">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
        <AdminFooter />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;