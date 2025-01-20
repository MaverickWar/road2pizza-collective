import { useAuth } from "@/components/AuthProvider";
import { Shield, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";

export const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <div className="fixed top-0 right-0 left-64 z-50 bg-admin-gradient p-4 md:p-6 shadow-admin animate-fade-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors whitespace-nowrap"
          >
            <Home className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Return to Site</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4 self-end sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm whitespace-nowrap">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Admin Access</span>
          </div>
          {user && <UserMenu user={user} isAdmin={true} />}
        </div>
      </div>
    </div>
  );
};