import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AvatarUpload } from './profile/AvatarUpload';

interface ProfileDialogProps {
  user: any;
  isAdmin: boolean;
}

export const ProfileDialog = ({ user, isAdmin }: ProfileDialogProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [lastResetTime, setLastResetTime] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileUpdate = async () => {
    try {
      if (!newUsername && !newEmail) {
        toast.error("Please provide at least one change");
        return;
      }

      if (isAdmin && user?.email === 'richgiles@hotmail.co.uk') {
        toast.error("Admin account details cannot be modified");
        return;
      }

      const { error } = await supabase
        .from('profile_change_requests')
        .insert({
          user_id: user?.id,
          requested_username: newUsername || null,
          requested_email: newEmail || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Profile change request submitted for review");
      setIsProfileOpen(false);
      setNewUsername('');
      setNewEmail('');
    } catch (error) {
      console.error('Error submitting profile change request:', error);
      toast.error("Failed to submit profile change request");
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    try {
      setIsChangingPassword(true);
      
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success("Password updated successfully");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error("Failed to update password");
    } finally {
      setIsChangingPassword(false);
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
      toast.success("Password reset email sent. Please check your inbox for further instructions.");
      setShowResetConfirm(false);
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast.error("Failed to send password reset email");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Profile Settings
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Request changes to your profile. Changes will be reviewed by an admin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <AvatarUpload
              userId={user.id}
              currentAvatarUrl={avatarUrl}
              onAvatarUpdate={setAvatarUrl}
            />
            <div className="grid gap-2">
              <Label htmlFor="username">New Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={isAdmin && user.email === 'richgiles@hotmail.co.uk'}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">New Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isAdmin && user.email === 'richgiles@hotmail.co.uk'}
              />
            </div>
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Change Password</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button 
                  variant="secondary" 
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="w-full"
                >
                  {isChangingPassword ? "Updating Password..." : "Update Password"}
                </Button>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowResetConfirm(true)}
              disabled={isResetting}
            >
              Reset Password via Email
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleProfileUpdate}>
              Submit Profile Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a password reset email to {user?.email}. You'll need to click the link in the email to set a new password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordReset} disabled={isResetting}>
              {isResetting ? "Sending..." : "Send Reset Email"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};