import { TableCell, TableRow } from "@/components/ui/table";
import UserRoleBadges from "../UserRoleBadges";
import UserStats from "../UserStats";
import UserAvatar from "./UserAvatar";
import UserStatus from "./UserStatus";
import UserActions from "./UserActions";

interface UserTableRowProps {
  user: any;
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
  onEditProfile: (user: any) => void;
  onManageStats: (user: any) => void;
  onDeleteUser: (userId: string) => void;
  onVerifyUser: (userId: string) => void;
  isMobile: boolean;
}

const UserTableRow = ({
  user,
  onToggleUserRole,
  onToggleSuspend,
  onEditProfile,
  onManageStats,
  onDeleteUser,
  onVerifyUser,
  isMobile
}: UserTableRowProps) => {
  if (isMobile) {
    return (
      <div className="space-y-4 p-4 bg-card rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <UserAvatar user={user} />
          <UserActions
            user={user}
            onToggleUserRole={onToggleUserRole}
            onToggleSuspend={onToggleSuspend}
            onEditProfile={onEditProfile}
            onManageStats={onManageStats}
            onDeleteUser={onDeleteUser}
            onVerifyUser={onVerifyUser}
          />
        </div>
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <UserRoleBadges isAdmin={user.is_admin} isStaff={user.is_staff} />
            <UserStatus isSuspended={user.is_suspended} isVerified={user.is_verified} />
          </div>
          <div className="border-t pt-3">
            <UserStats
              points={user.points}
              badgeTitle={user.badge_title}
              badgeColor={user.badge_color}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell>
        <UserAvatar user={user} />
      </TableCell>
      <TableCell>
        <UserRoleBadges isAdmin={user.is_admin} isStaff={user.is_staff} />
      </TableCell>
      <TableCell>
        <UserStats
          points={user.points}
          badgeTitle={user.badge_title}
          badgeColor={user.badge_color}
        />
      </TableCell>
      <TableCell>
        <UserStatus isSuspended={user.is_suspended} isVerified={user.is_verified} />
      </TableCell>
      <TableCell className="text-right">
        <UserActions
          user={user}
          onToggleUserRole={onToggleUserRole}
          onToggleSuspend={onToggleSuspend}
          onEditProfile={onEditProfile}
          onManageStats={onManageStats}
          onDeleteUser={onDeleteUser}
          onVerifyUser={onVerifyUser}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;