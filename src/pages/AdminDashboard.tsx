import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Welcome, {user?.email}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Add admin-specific content and controls here */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;