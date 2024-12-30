import AdminLayout from "@/components/admin/layout/AdminLayout";
import StatsOverview from "@/components/admin/dashboard/StatsOverview";
import { useEffect } from "react";

const AdminOverview = () => {
  useEffect(() => {
    console.log("Rendering AdminOverview component");
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome to your pizza community dashboard
          </p>
        </div>
        <StatsOverview />
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;