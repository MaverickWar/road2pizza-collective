import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileDialog } from './ProfileDialog';

interface UserMenuProps {
  user: any;
  isAdmin: boolean;
}

export const UserMenu = ({ user, isAdmin }: UserMenuProps) => {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);
  const [lastResetTime, setLastResetTime] = useState(0);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const handlePasswordReset = async () => {
    const now = Date.now();
    const timeSinceLastReset = now - lastResetTime;
    const COOLDOWN_PERIOD = 55 * 1000; // 55 seconds in milliseconds

    if (timeSinceLastReset < COOLDOWN_PERIOD) {
      const remainingTime = Math.ceil((COOLDOWN_PERIOD - timeSinceLastReset) / 1000);
      toast.error(`Please wait ${remainingTime} seconds before requesting another reset`);
      return;
    }

    try {
      setIsResetting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setLastResetTime(now);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast.error("Failed to send password reset email");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 rounded-full hover:bg-white/20 ring-2 ring-white p-0"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user_metadata?.username || user.id}`} />
            <AvatarFallback>
              <UserRound className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg" 
        align="end"
        sideOffset={5}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.username || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ProfileDialog user={user} isAdmin={isAdmin} />
        <DropdownMenuItem 
          onSelect={handlePasswordReset}
          disabled={isResetting}
        >
          <Key className="w-4 h-4 mr-2" />
          {isResetting ? 'Sending...' : 'Reset Password'}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/dashboard')}>
          {isAdmin ? 'Admin' : 'Member'} Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};