import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import UserStatsDialog from "./UserStatsDialog";
import UserProfileDialog from "./UserProfileDialog";
import UserTableRow from "./users/UserTableRow";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/use-mobile";

interface UserManagementTableProps {
  users: any[];
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
}

const UserManagementTable = ({ users, onToggleUserRole, onToggleSuspend }: UserManagementTableProps) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleDeleteUser = async (userId: string) => {
    try {
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

  return (
    <div className="relative">
      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {users?.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
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
          ))}
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">User</TableHead>
                <TableHead className="w-[150px]">Roles</TableHead>
                <TableHead className="w-[200px]">Stats</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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