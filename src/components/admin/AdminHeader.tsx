import { useAuth } from "@/components/AuthProvider";
import { Shield } from "lucide-react";

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 right-0 left-64 z-50 bg-admin-gradient p-6 shadow-admin animate-fade-up">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/80">
            Welcome back, {user?.email}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
          <Shield className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">Admin Access</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;