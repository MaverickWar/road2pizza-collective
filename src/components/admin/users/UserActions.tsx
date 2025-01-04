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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ban, CheckCircle, MoreHorizontal, Shield, Trash2, UserCog } from "lucide-react";

interface UserActionsProps {
  user: any;
  onToggleUserRole: (userId: string, role: 'admin' | 'staff', currentStatus: boolean) => Promise<void>;
  onToggleSuspend: (userId: string, currentStatus: boolean) => Promise<void>;
  onEditProfile: (user: any) => void;
  onManageStats: (user: any) => void;
  onDeleteUser: (userId: string) => void;
  onVerifyUser: (userId: string) => void;
}

const UserActions = ({
  user,
  onToggleUserRole,
  onToggleSuspend,
  onEditProfile,
  onManageStats,
  onDeleteUser,
  onVerifyUser,
}: UserActionsProps) => {
  console.log("Rendering user actions for:", user);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => onEditProfile(user)}
          className="cursor-pointer"
        >
          <UserCog className="w-4 h-4 mr-2" />
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onToggleUserRole(user.id, 'admin', user.is_admin)}
          className="cursor-pointer"
        >
          <Shield className="w-4 h-4 mr-2" />
          {user.is_admin ? 'Remove Admin' : 'Make Admin'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onToggleUserRole(user.id, 'staff', user.is_staff)}
          className="cursor-pointer"
        >
          <UserCog className="w-4 h-4 mr-2" />
          {user.is_staff ? 'Remove Staff' : 'Make Staff'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onToggleSuspend(user.id, user.is_suspended)}
          className="cursor-pointer text-red-600"
        >
          <Ban className="w-4 h-4 mr-2" />
          {user.is_suspended ? 'Unsuspend' : 'Suspend'}
        </DropdownMenuItem>
        {!user.is_verified && (
          <DropdownMenuItem 
            onClick={() => onVerifyUser(user.id)}
            className="cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Verify User
          </DropdownMenuItem>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem 
              className="cursor-pointer text-red-600"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user's
                account and remove all associated data.
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
  );
};

export default UserActions;