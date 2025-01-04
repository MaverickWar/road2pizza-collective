import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import UserRoleBadges from "../UserRoleBadges";
import UserStats from "../UserStats";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserCog, ChartBar, Shield, Ban, Trash2, CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{user.username}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEditProfile(user)}>
                <UserCog className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageStats(user)}>
                <ChartBar className="w-4 h-4 mr-2" />
                Manage Stats
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onToggleUserRole(user.id, 'admin', user.is_admin)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Toggle Admin
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onToggleUserRole(user.id, 'staff', user.is_staff)}
              >
                <UserCog className="w-4 h-4 mr-2" />
                Toggle Staff
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onToggleSuspend(user.id, user.is_suspended)}
                className="text-red-600"
              >
                <Ban className="w-4 h-4 mr-2" />
                {user.is_suspended ? 'Unsuspend' : 'Suspend'}
              </DropdownMenuItem>
              {!user.is_verified && (
                <DropdownMenuItem onClick={() => onVerifyUser(user.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify User
                </DropdownMenuItem>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the user's account and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDeleteUser(user.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-2">
          <UserRoleBadges isAdmin={user.is_admin} isStaff={user.is_staff} />
          <UserStats
            points={user.points}
            badgeTitle={user.badge_title}
            badgeColor={user.badge_color}
          />
          <div className="flex gap-2">
            {user.is_suspended && (
              <Badge variant="destructive">Suspended</Badge>
            )}
            {!user.is_verified && (
              <Badge variant="secondary">Unverified</Badge>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{user.username}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
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
        <div className="flex flex-col gap-1">
          {user.is_suspended && (
            <Badge variant="destructive">Suspended</Badge>
          )}
          {!user.is_verified && (
            <Badge variant="secondary">Unverified</Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEditProfile(user)}>
              <UserCog className="w-4 h-4 mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManageStats(user)}>
              <ChartBar className="w-4 h-4 mr-2" />
              Manage Stats
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onToggleUserRole(user.id, 'admin', user.is_admin)}
            >
              <Shield className="w-4 h-4 mr-2" />
              Toggle Admin
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onToggleUserRole(user.id, 'staff', user.is_staff)}
            >
              <UserCog className="w-4 h-4 mr-2" />
              Toggle Staff
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onToggleSuspend(user.id, user.is_suspended)}
              className="text-red-600"
            >
              <Ban className="w-4 h-4 mr-2" />
              {user.is_suspended ? 'Unsuspend' : 'Suspend'}
            </DropdownMenuItem>
            {!user.is_verified && (
              <DropdownMenuItem onClick={() => onVerifyUser(user.id)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify User
              </DropdownMenuItem>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user's account and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;