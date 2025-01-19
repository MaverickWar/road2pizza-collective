import { useAuthState } from "@/hooks/useAuthState";
import AdminHeader from "./admin/AdminHeader";
import { AdminSidebar } from "./admin/AdminSidebar";
import AdminFooter from "./admin/AdminFooter";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar/SidebarContext";

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