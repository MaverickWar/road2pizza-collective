import { useAuth } from "@/components/AuthProvider";
import { Shield } from "lucide-react";

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-secondary/50 p-6 rounded-lg backdrop-blur-sm animate-fade-up relative z-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.email}
        </p>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg">
        <Shield className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium">Admin Access</span>
      </div>
    </div>
  );
};

export default AdminHeader;
