import { TableBody } from "@/components/ui/table";
import UserTableRow from "./UserTableRow";

interface UserTableContentProps {
  users: any[];
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
  onEditProfile: (user: any) => void;
  onManageStats: (user: any) => void;
  onDeleteUser: (userId: string) => void;
  onVerifyUser: (userId: string) => void;
  isMobile: boolean;
}

const UserTableContent = ({ 
  users,
  onToggleUserRole,
  onToggleSuspend,
  onEditProfile,
  onManageStats,
  onDeleteUser,
  onVerifyUser,
  isMobile
}: UserTableContentProps) => {
  console.log("Rendering UserTableContent with users:", users);
  
  return (
    <TableBody>
      {users?.map((user) => (
        <UserTableRow
          key={user.id}
          user={user}
          onToggleUserRole={onToggleUserRole}
          onToggleSuspend={onToggleSuspend}
          onEditProfile={onEditProfile}
          onManageStats={onManageStats}
          onDeleteUser={onDeleteUser}
          onVerifyUser={onVerifyUser}
          isMobile={isMobile}
        />
      ))}
    </TableBody>
  );
};

export default UserTableContent;