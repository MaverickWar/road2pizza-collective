import DashboardLayout from "@/components/DashboardLayout";
import UserManagementTable from "@/components/admin/UserManagementTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const UserManagement = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching users...");
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching users:", error);
          throw error;
        }

        console.log("Fetched users:", data);
        return data || [];
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
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
        <div className="text-center py-8">
          <p className="text-red-500">Error loading users. Please try again later.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {isLoading ? (
          <div className="space-y-4 md:space-y-6 animate-pulse">
            <div className="h-20 bg-secondary/50 rounded-lg" />
            <div className="h-[400px] bg-secondary/50 rounded-lg" />
          </div>
        ) : (
          <UserManagementTable
            users={users || []}
            onToggleUserRole={handleToggleUserRole}
            onToggleSuspend={handleToggleSuspend}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;