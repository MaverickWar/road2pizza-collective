import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";

const StaffDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Recipe Management</h1>
        <p>Welcome, {user?.email}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add recipe management controls here */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;