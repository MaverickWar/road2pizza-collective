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

  // Function to update specific user's username
  const updateSpecificUsername = async () => {
    try {
      console.log("Attempting to update username for meanmachine01@hotmail.com");
      
      // First get the user's ID
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', 'meanmachine01@hotmail.com')
        .single();

      if (userError) {
        console.error("Error finding user:", userError);
        throw userError;
      }

      if (!userData) {
        toast.error("User not found");
        return;
      }

      // Check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', 'MeanMachine')
        .neq('id', userData.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        toast.error("Username MeanMachine is already taken");
        return;
      }

      // Update the username
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: 'MeanMachine' })
        .eq('id', userData.id);

      if (updateError) throw updateError;
      
      toast.success("Username updated to MeanMachine successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Failed to update username");
    }
  };

  // Call the function immediately when component mounts
  React.useEffect(() => {
    updateSpecificUsername();
  }, []);

  if (isMobile) {
    return (
      <div className="space-y-6">
        {users?.map((user) => (
          <div 
            key={user.id} 
            className="bg-card rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-fade-up p-4"
          >
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
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[250px]">User</TableHead>
            <TableHead className="w-[150px]">Roles</TableHead>
            <TableHead className="w-[200px]">Stats</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[180px] text-right">Actions</TableHead>
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
