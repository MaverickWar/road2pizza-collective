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

  if (isMobile) {
    return (
      <div className="space-y-4 px-4">
        {users?.map((user) => (
          <div key={user.id} className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{user.username}</h3>
                  {user.email && (
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  )}
                </div>
              </div>

              <UserTableRow
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
            </div>
          </div>
        ))}

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
    <div className="w-full overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead>Status</TableHead>
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