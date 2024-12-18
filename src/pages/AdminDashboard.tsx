import { useAuth } from "@/components/AuthProvider";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      {/* Admin-specific content will be implemented in the next iteration */}
    </div>
  );
};

export default AdminDashboard;