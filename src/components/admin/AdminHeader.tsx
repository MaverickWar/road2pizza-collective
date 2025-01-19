import { useAuth } from "@/components/AuthProvider";
import { Shield, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";

export const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 right-0 left-64 z-50 bg-admin-gradient p-6 shadow-admin animate-fade-up">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <Home className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Return to Site</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Admin Access</span>
          </div>
          {user && <UserMenu user={user} isAdmin={true} />}
        </div>
      </div>
    </div>
  );
};