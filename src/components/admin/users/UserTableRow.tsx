import { TableCell, TableRow } from "@/components/ui/table";
import UserRoleBadges from "../UserRoleBadges";
import UserStats from "../UserStats";
import UserApprovalToggle from "./UserApprovalToggle";
import UserCard from "./UserCard";
import UserActions from "./UserActions";

interface UserTableRowProps {
  user: any;
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
  onEditProfile: (user: any) => void;
  onManageStats: (user: any) => void;
  onDeleteUser: (userId: string) => Promise<void>;
  onVerifyUser: (userId: string) => Promise<void>;
  isMobile?: boolean;
}

const UserTableRow = ({ 
  user,
  onToggleUserRole,
  onToggleSuspend,
  onEditProfile,
  onManageStats,
  onDeleteUser,
  onVerifyUser,
  isMobile = false
}: UserTableRowProps) => {
  const UserContent = () => (
    <>
      <div className="space-y-3">
        <UserRoleBadges isAdmin={user.is_admin} isStaff={user.is_staff} />
        
        <UserStats 
          points={user.points} 
          badgeTitle={user.badge_title} 
          badgeColor={user.badge_color} 
        />
        
        <UserApprovalToggle
          userId={user.id}
          requiresApproval={user.requires_recipe_approval}
          onUpdate={() => window.location.reload()}
        />
        
        <div>
          <span
            className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-full ${
              user.is_suspended
                ? "bg-red-100 text-red-700"
                : user.is_verified
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {user.is_suspended ? "Suspended" : user.is_verified ? "Active" : "Pending Verification"}
          </span>
        </div>
      </div>
      
      <UserActions
        user={user}
        onToggleUserRole={onToggleUserRole}
        onToggleSuspend={onToggleSuspend}
        onEditProfile={onEditProfile}
        onManageStats={onManageStats}
        onDeleteUser={onDeleteUser}
        onVerifyUser={onVerifyUser}
        isMobile={isMobile}
      />
    </>
  );

  if (isMobile) {
    return (
      <UserCard user={user}>
        <UserContent />
      </UserCard>
    );
  }

  return (
    <TableRow className="group hover:bg-secondary/50">
      <TableCell className="max-w-[200px]">
        <UserCard user={user}>
          <></>
        </UserCard>
      </TableCell>
      <TableCell className="max-w-[150px]">
        <UserRoleBadges isAdmin={user.is_admin} isStaff={user.is_staff} />
      </TableCell>
      <TableCell className="max-w-[200px]">
        <div className="space-y-2">
          <UserStats 
            points={user.points} 
            badgeTitle={user.badge_title} 
            badgeColor={user.badge_color} 
          />
          <UserApprovalToggle
            userId={user.id}
            requiresApproval={user.requires_recipe_approval}
            onUpdate={() => window.location.reload()}
          />
        </div>
      </TableCell>
      <TableCell className="max-w-[150px]">
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            user.is_suspended
              ? "bg-red-100 text-red-700"
              : user.is_verified
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {user.is_suspended ? "Suspended" : user.is_verified ? "Active" : "Pending Verification"}
        </span>
      </TableCell>
      <TableCell className="max-w-[100px]">
        <UserActions
          user={user}
          onToggleUserRole={onToggleUserRole}
          onToggleSuspend={onToggleSuspend}
          onEditProfile={onEditProfile}
          onManageStats={onManageStats}
          onDeleteUser={onDeleteUser}
          onVerifyUser={onVerifyUser}
          isMobile={false}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;