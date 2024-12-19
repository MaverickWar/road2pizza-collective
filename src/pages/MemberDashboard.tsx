import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";

const MemberDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <p>Welcome, {user?.email}</p>
        <div className="grid grid-cols-1 gap-4">
          {/* Add user's reviews list here */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;