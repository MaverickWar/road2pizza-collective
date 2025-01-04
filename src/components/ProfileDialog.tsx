import { useState, useCallback } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, UserRound } from 'lucide-react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setIsUploading(true);
      console.log('Starting image upload for user:', user.id);

      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update profile image');
    } finally {
      setIsUploading(false);
    }
  };

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
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                  alt={user?.username || 'Profile'}
                />
                <AvatarFallback>
                  <UserRound className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Label>
              </div>
            </div>
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
            <Button
              variant="secondary"
              onClick={() => setShowResetConfirm(true)}
              disabled={isResetting}
            >
              Reset Password
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleProfileUpdate}>
              Submit Request
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