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
      <div className="min-h-screen bg-admin-background">
        <div className="flex min-h-screen">
          {/* Sidebar - fixed position */}
          <AdminSidebar />
          
          {/* Main content area - flex grow */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Header - sticky at top of content area */}
            <AdminHeader />
            
            {/* Main content - scrollable */}
            <main className="flex-1 p-6 pt-24">
              {children}
            </main>
            
            {/* Footer */}
            <AdminFooter />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;