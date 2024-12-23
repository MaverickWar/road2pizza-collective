import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import UserManagementTable from "@/components/admin/UserManagementTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Ban } from "lucide-react";

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles, permissions, and account status
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffUsers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended Users</CardTitle>
              <Ban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suspendedUsers.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="active">Active Users</TabsTrigger>
            <TabsTrigger value="staff">Staff Members</TabsTrigger>
            <TabsTrigger value="suspended">Suspended Users</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardContent className="pt-6">
                <UserManagementTable
                  users={users || []}
                  onToggleUserRole={handleToggleUserRole}
                  onToggleSuspend={handleToggleSuspend}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardContent className="pt-6">
                <UserManagementTable
                  users={activeUsers}
                  onToggleUserRole={handleToggleUserRole}
                  onToggleSuspend={handleToggleSuspend}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardContent className="pt-6">
                <UserManagementTable
                  users={staffUsers}
                  onToggleUserRole={handleToggleUserRole}
                  onToggleSuspend={handleToggleSuspend}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suspended">
            <Card>
              <CardContent className="pt-6">
                <UserManagementTable
                  users={suspendedUsers}
                  onToggleUserRole={handleToggleUserRole}
                  onToggleSuspend={handleToggleSuspend}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;