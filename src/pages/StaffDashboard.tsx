import { useAuth } from "@/components/AuthProvider";

const StaffDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      {/* Staff-specific content will be implemented in the next iteration */}
    </div>
  );
};

export default StaffDashboard;