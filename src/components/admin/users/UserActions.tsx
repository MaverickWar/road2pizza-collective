import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Award, Ban, CheckCircle, Eye, Key, MoreHorizontal, Shield, Trash2, User, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserActionsProps {
  user: any;
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
  onEditProfile: (user: any) => void;
  onManageStats: (user: any) => void;
  onDeleteUser: (userId: string) => Promise<void>;
  onVerifyUser: (userId: string) => Promise<void>;
  isMobile?: boolean;
}

const UserActions = ({ 
  user,
  onToggleUserRole,
  onToggleSuspend,
  onEditProfile,
  onManageStats,
  onDeleteUser,
  onVerifyUser,
  isMobile = false
}: UserActionsProps) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={isMobile ? "w-full justify-start" : ""}>
          {isMobile ? (
            <span className="flex items-center">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Actions
            </span>
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "end" : "end"} className="w-[200px]">
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
  );
};

export default UserActions;