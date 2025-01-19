import { useAuth } from "@/hooks/useAuthState";
import AdminHeader from "./admin/AdminHeader";
import AdminSidebar from "./admin/AdminSidebar";
import AdminFooter from "./admin/AdminFooter";
import { useLocation, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { UserMenu } from "./UserMenu";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  return (
    <div className="min-h-screen bg-admin-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <AdminFooter />
    </div>
  );
};

export default DashboardLayout;
