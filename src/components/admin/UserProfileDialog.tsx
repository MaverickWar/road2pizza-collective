import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfileDialogProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UserProfileDialog = ({ user, open, onOpenChange, onSuccess }: UserProfileDialogProps) => {
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (userId: string) => {
    try {
      setIsSubmitting(true);
      console.log("Updating profile for user:", userId);
      
      // Check if trying to change admin's details
      if (user?.is_admin && user?.email === 'richgiles@hotmail.co.uk') {
        toast.error("Admin account details cannot be modified");
        return;
      }

      // First check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingUser) {
        toast.error("Username is already taken");
        return;
      }

      // Check if email is being changed
      if (email !== user.email) {
        // Create a profile change request for email change
        const { error: requestError } = await supabase
          .from('profile_change_requests')
          .insert({
            user_id: userId,
            requested_email: email,
            status: 'pending'
          });

        if (requestError) throw requestError;
        
        toast.success("Email change request submitted for admin approval");
      }

      // Update other profile fields
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          avatar_url: avatarUrl,
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success("User profile updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Failed to update user profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isSubmitting || (user?.is_admin && user?.email === 'richgiles@hotmail.co.uk')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled={isSubmitting || (user?.is_admin && user?.email === 'richgiles@hotmail.co.uk')}
            />
            {email !== user.email && (
              <p className="text-sm text-muted-foreground">
                Email changes require admin approval
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enter user bio"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL</Label>
            <Input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Enter avatar URL"
              disabled={isSubmitting}
            />
          </div>
          <Button
            className="w-full"
            onClick={() => handleUpdateProfile(user.id)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;