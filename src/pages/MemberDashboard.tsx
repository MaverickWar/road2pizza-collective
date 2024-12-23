import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";
import MyReviews from "@/components/reviews/MyReviews";

const MemberDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Welcome, {user?.email}
          </div>
        </div>
        <MyReviews />
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;