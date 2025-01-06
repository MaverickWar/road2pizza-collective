import DashboardLayout from "@/components/DashboardLayout";
import UserManagementTable from "@/components/admin/UserManagementTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UserManagement = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching users...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        throw error;
      }

      console.log("Fetched users:", data);
      return data || [];
    },
  });

  const handleToggleUserRole = async (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => {
    try {
      console.log(`Toggling ${role} role for user:`, userId);
      const updateField = role === 'admin' ? 'is_admin' : 'is_staff';
      const { error } = await supabase
        .from("profiles")
        .update({ [updateField]: !currentStatus })
        .eq("id", userId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`User ${role} status updated`);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(`Failed to update user ${role} status`);
    }
  };

  const handleToggleSuspend = async (userId: string, currentStatus: boolean) => {
    try {
      console.log("Toggling suspension for user:", userId);
      const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: !currentStatus })
        .eq("id", userId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User suspension status updated");
    } catch (error) {
      console.error("Error updating user suspension:", error);
      toast.error("Failed to update user suspension status");
    }
  };

  if (error) {
    console.error("Error in UserManagement:", error);
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4 md:p-6">
          <div className="text-center py-8">
            <p className="text-red-500">Error loading users. Please try again later.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4 md:p-6">
          <div className="space-y-4 md:space-y-6 animate-pulse">
            <div className="h-20 bg-secondary/50 rounded-lg" />
            <div className="h-[400px] bg-secondary/50 rounded-lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage users, roles, and permissions
            </p>
          </div>

          <div className="overflow-hidden">
            <UserManagementTable
              users={users}
              onToggleUserRole={handleToggleUserRole}
              onToggleSuspend={handleToggleSuspend}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;