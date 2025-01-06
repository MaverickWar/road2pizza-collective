import {
  Table,
} from "@/components/ui/table";
import { useState } from "react";
import UserStatsDialog from "./UserStatsDialog";
import UserProfileDialog from "./UserProfileDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/use-mobile";
import UserTableHeader from "./users/UserTableHeader";
import UserTableContent from "./users/UserTableContent";

interface UserManagementTableProps {
  users: any[];
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
}

const UserManagementTable = ({ users, onToggleUserRole, onToggleSuspend }: UserManagementTableProps) => {
  console.log("UserManagementTable rendered with users:", users);
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleDeleteUser = async (userId: string) => {
    try {
      console.log("Attempting to delete user:", userId);
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      toast.success("User deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      console.log("Attempting to verify user:", userId);
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success("User verified successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error("Failed to verify user");
    }
  };

  if (!users) {
    console.log("No users data available");
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-6">
        <UserTableContent
          users={users}
          onToggleUserRole={onToggleUserRole}
          onToggleSuspend={onToggleSuspend}
          onEditProfile={(user) => {
            setSelectedUser(user);
            setProfileDialogOpen(true);
          }}
          onManageStats={(user) => {
            setSelectedUser(user);
            setStatsDialogOpen(true);
          }}
          onDeleteUser={handleDeleteUser}
          onVerifyUser={handleVerifyUser}
          isMobile={true}
        />

        <UserStatsDialog
          user={selectedUser}
          open={statsDialogOpen}
          onOpenChange={setStatsDialogOpen}
          onSuccess={() => {
            setSelectedUser(null);
          }}
        />

        <UserProfileDialog
          user={selectedUser}
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          onSuccess={() => {
            setSelectedUser(null);
            window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <UserTableHeader />
        <UserTableContent
          users={users}
          onToggleUserRole={onToggleUserRole}
          onToggleSuspend={onToggleSuspend}
          onEditProfile={(user) => {
            setSelectedUser(user);
            setProfileDialogOpen(true);
          }}
          onManageStats={(user) => {
            setSelectedUser(user);
            setStatsDialogOpen(true);
          }}
          onDeleteUser={handleDeleteUser}
          onVerifyUser={handleVerifyUser}
          isMobile={false}
        />
      </Table>

      <UserStatsDialog
        user={selectedUser}
        open={statsDialogOpen}
        onOpenChange={setStatsDialogOpen}
        onSuccess={() => {
          setSelectedUser(null);
        }}
      />

      <UserProfileDialog
        user={selectedUser}
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        onSuccess={() => {
          setSelectedUser(null);
          window.location.reload();
        }}
      />
    </div>
  );
};

export default UserManagementTable;