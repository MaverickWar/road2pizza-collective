import { TableCell, TableRow } from "@/components/ui/table";
import UserRoleBadges from "../UserRoleBadges";
import UserStats from "../UserStats";
import UserApprovalToggle from "./UserApprovalToggle";
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
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{user.username}</p>
            {user.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 divide-y divide-gray-100">
          <div className="pt-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Roles</div>
            <UserRoleBadges isAdmin={user.is_admin} isStaff={user.is_staff} />
          </div>
          
          <div className="pt-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Stats</div>
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
          </div>
          
          <div className="pt-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Status</div>
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
          
          <div className="pt-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Actions</div>
            <UserActions
              user={user}
              onToggleUserRole={onToggleUserRole}
              onToggleSuspend={onToggleSuspend}
              onEditProfile={onEditProfile}
              onManageStats={onManageStats}
              onDeleteUser={onDeleteUser}
              onVerifyUser={onVerifyUser}
              isMobile={true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{user.username}</p>
            {user.email && (
              <p className="text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <UserRoleBadges isAdmin={user.is_admin} isStaff={user.is_staff} />
      </TableCell>
      <TableCell>
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
      <TableCell>
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
      <TableCell>
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