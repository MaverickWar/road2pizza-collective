import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import UserTabs from "@/components/admin/users/UserTabs";
import { toast } from "sonner";
import type { ProfileChangeRequest } from "@/types/profile";

const UserManagement = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
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

  const { data: changeRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["profile-change-requests"],
    queryFn: async () => {
      console.log("Fetching change requests...");
      const { data, error } = await supabase
        .from("profile_change_requests")
        .select(`
          *,
          profiles!profile_change_requests_user_id_fkey (
            username
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching change requests:", error);
        toast.error("Failed to load change requests");
        throw error;
      }

      console.log("Fetched change requests:", data);
      // Cast the status to the correct type since we know Supabase enforces these values
      return (data || []).map(request => ({
        ...request,
        status: request.status as "pending" | "approved" | "rejected"
      })) as ProfileChangeRequest[];
    },
  });

  const handleToggleUserRole = async (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => {
    try {
      const updateField = role === 'admin' ? 'is_admin' : 'is_staff';
      const { error } = await supabase
        .from("profiles")
        .update({ [updateField]: !currentStatus })
        .eq("id", userId);
      
      if (error) throw error;
      
      toast.success(`User ${role} status updated`);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(`Failed to update user ${role} status`);
    }
  };

  const handleToggleSuspend = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: !currentStatus })
        .eq("id", userId);
      
      if (error) throw error;
      
      toast.success("User suspension status updated");
    } catch (error) {
      console.error("Error updating user suspension:", error);
      toast.error("Failed to update user suspension status");
    }
  };

  const activeUsers = users.filter(user => !user.is_suspended);
  const staffUsers = users.filter(user => user.is_staff || user.is_admin);
  const suspendedUsers = users.filter(user => user.is_suspended);
  const pendingRequests = changeRequests.filter(req => req.status === 'pending');

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-20 bg-secondary/50 rounded-lg" />
          <div className="h-[400px] bg-secondary/50 rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UserTabs
          users={users}
          activeUsers={activeUsers}
          staffUsers={staffUsers}
          suspendedUsers={suspendedUsers}
          changeRequests={changeRequests}
          pendingRequestsCount={pendingRequests.length}
          onToggleUserRole={handleToggleUserRole}
          onToggleSuspend={handleToggleSuspend}
          loadingRequests={loadingRequests}
          onRequestStatusUpdate={() => {
            queryClient.invalidateQueries({ queryKey: ["profile-change-requests"] });
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;