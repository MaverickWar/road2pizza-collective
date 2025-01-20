import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormLayout, FormSection, FormActions } from "@/components/ui/form-layout";

interface UsernamePromptDialogProps {
  open: boolean;
  userId: string;
  currentUsername: string;
  onUsernameSet: () => void;
}

const UsernamePromptDialog = ({ open, userId, currentUsername, onUsernameSet }: UsernamePromptDialogProps) => {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!username || username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Updating username for user:", userId);

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

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast.success("Username updated successfully");
      onUsernameSet();
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Failed to update username");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-background border-0 shadow-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Choose Your Username</DialogTitle>
        </DialogHeader>
        <FormLayout>
          <p className="text-sm text-muted-foreground">
            Please choose a username to continue. Your current temporary username is {currentUsername}.
          </p>
          <FormSection>
            <Label htmlFor="username" className="text-sm font-medium leading-none">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isSubmitting}
              className="w-full"
            />
          </FormSection>
          <FormActions>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Set Username"}
            </Button>
          </FormActions>
        </FormLayout>
      </DialogContent>
    </Dialog>
  );
};

export default UsernamePromptDialog;