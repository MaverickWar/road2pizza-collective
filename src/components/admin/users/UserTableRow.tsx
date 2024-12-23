import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns";
import { MoreHorizontal, Shield, UserCog, Ban, Eye, User, Award } from "lucide-react";
import UserRoleBadges from "../UserRoleBadges";
import UserStats from "../UserStats";

interface UserTableRowProps {
  user: any;
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
  onEditProfile: (user: any) => void;
  onManageStats: (user: any) => void;
}

const UserTableRow = ({ 
  user, 
  onToggleUserRole, 
  onToggleSuspend,
  onEditProfile,
  onManageStats 
}: UserTableRowProps) => {
  return (
    <TableRow className="group hover:bg-secondary/50">
      <TableCell>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="flex items-center space-x-2">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <span>{user.username}</span>
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{user.username}</h4>
              {user.bio && (
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Joined {format(new Date(user.created_at), "MMMM yyyy")}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
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
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            user.is_suspended
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {user.is_suspended ? "Suspended" : "Active"}
        </span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => onEditProfile(user)}>
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManageStats(user)}>
              <Award className="w-4 h-4 mr-2" />
              Manage Stats
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleUserRole(user.id, 'admin', user.is_admin)}>
              <Shield className="w-4 h-4 mr-2" />
              {user.is_admin ? "Remove Admin" : "Make Admin"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleUserRole(user.id, 'staff', user.is_staff)}>
              <UserCog className="w-4 h-4 mr-2" />
              {user.is_staff ? "Remove Staff" : "Make Staff"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleSuspend(user.id, user.is_suspended)}>
              {user.is_suspended ? (
                <Eye className="w-4 h-4 mr-2" />
              ) : (
                <Ban className="w-4 h-4 mr-2" />
              )}
              {user.is_suspended ? "Activate" : "Suspend"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;