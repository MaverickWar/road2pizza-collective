import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordManagementProps {
  user: any;
  onSuccess: () => void;
}

export const PasswordManagement = ({ user, onSuccess }: PasswordManagementProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
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
      console.log("Attempting to update password...");

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error changing password:', error);
        
        // Check if the error response contains a JSON string
        if (typeof error.message === 'string' && error.message.startsWith('{')) {
          try {
            const parsedError = JSON.parse(error.message);
            if (parsedError.code === 'same_password') {
              toast.error("New password must be different from your current password");
              return;
            }
          } catch (parseError) {
            console.error('Error parsing error message:', parseError);
          }
        }
        
        // If we couldn't parse the error or it's a different error
        toast.error(error.message || "Failed to update password");
        return;
      }

      console.log("Password update response:", data);
      toast.success("Password updated successfully");
      setNewPassword('');
      setConfirmPassword('');
      onSuccess();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error("Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="border-t pt-4">
      <h4 className="text-sm font-medium mb-2">Change Password</h4>
      <div className="space-y-3">
        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={isChangingPassword}
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
            disabled={isChangingPassword}
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
  );
};