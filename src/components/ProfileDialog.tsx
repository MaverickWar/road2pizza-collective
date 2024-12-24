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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ProfileDialogProps {
  user: any;
  isAdmin: boolean;
}

export const ProfileDialog = ({ user, isAdmin }: ProfileDialogProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

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

  return (
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
        </div>
        <div className="flex justify-end">
          <Button onClick={handleProfileUpdate}>
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};