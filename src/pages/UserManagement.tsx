import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import UserStatsCards from "@/components/admin/users/UserStatsCards";
import UserTabs from "@/components/admin/users/UserTabs";
import type { ProfileChangeRequest } from "@/types/profile";

const UserManagement = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching users for management...");
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: changeRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["profile-change-requests"],
    queryFn: async () => {
      console.log("Fetching profile change requests...");
      const { data, error } = await supabase
        .from("profile_change_requests")
        .select(`
          *,
          profiles!profile_change_requests_user_id_fkey (
            username
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedData = data?.map(request => ({
        ...request,
        profiles: request.profiles ? { username: request.profiles.username } : null
      }));
      
      return transformedData as ProfileChangeRequest[];
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
      
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
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
      
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User suspension status updated");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user suspension status");
    }
  };

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

  const activeUsers = users?.filter(user => !user.is_suspended) || [];
  const suspendedUsers = users?.filter(user => user.is_suspended) || [];
  const staffUsers = users?.filter(user => user.is_staff || user.is_admin) || [];
  const pendingRequests = changeRequests?.filter(req => req.status === 'pending') || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-full overflow-x-hidden px-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles, permissions, and account status
          </p>
        </div>

        <UserStatsCards
          totalUsers={users?.length || 0}
          staffCount={staffUsers.length}
          suspendedCount={suspendedUsers.length}
          pendingRequestsCount={pendingRequests.length}
        />

        <UserTabs
          users={users || []}
          activeUsers={activeUsers}
          staffUsers={staffUsers}
          suspendedUsers={suspendedUsers}
          changeRequests={changeRequests || []}
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