import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import UserRoleBadges from "../UserRoleBadges";
import UserStats from "../UserStats";
import UserApprovalToggle from "./UserApprovalToggle";
import { MoreHorizontal, Shield, UserCog, Ban, Eye, User, Award, Trash2, Key, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface UserTableRowProps {
  user: any;
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
  onEditProfile: (user: any) => void;
  onManageStats: (user: any) => void;
  onDeleteUser: (userId: string) => Promise<void>;
  onVerifyUser: (userId: string) => Promise<void>;
}

const UserTableRow = ({ 
  user, 
  onToggleUserRole, 
  onToggleSuspend,
  onEditProfile,
  onManageStats,
  onDeleteUser,
  onVerifyUser
}: UserTableRowProps) => {
  const isMainAdmin = user.email === 'richgiles@hotmail.co.uk';

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset email sent");
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast.error("Failed to send password reset email");
    }
  };

  return (
    <TableRow className="group hover:bg-secondary/50">
      <TableCell className="max-w-[200px]">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="flex items-center space-x-2 truncate">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.username}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <span className="truncate">{user.username}</span>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-[200px] bg-card"
          >
            <DropdownMenuItem onClick={() => onEditProfile(user)}>
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResetPassword}>
              <Key className="w-4 h-4 mr-2" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManageStats(user)}>
              <Award className="w-4 h-4 mr-2" />
              Manage Stats
            </DropdownMenuItem>
            {!user.is_verified && (
              <DropdownMenuItem onClick={() => onVerifyUser(user.id)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify User
              </DropdownMenuItem>
            )}
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
            {!isMainAdmin && (
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600" 
                onClick={() => onDeleteUser(user.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;